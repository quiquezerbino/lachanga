"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";

interface Verification {
  id: string;
  user_id: string;
  cedula_url: string;
  selfie_url: string;
  ai_result: string;
  ai_confidence: number | null;
  ai_reasoning: string | null;
  admin_decision: string | null;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export default function VerificacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [verification, setVerification] = useState<Verification | null>(null);
  const [profileName, setProfileName] = useState("");
  const [cedulaUrl, setCedulaUrl] = useState<string | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: v } = await supabase
        .from("verifications")
        .select("*")
        .eq("id", id)
        .single();

      if (!v) { setLoading(false); return; }
      setVerification(v as Verification);

      // Get profile name
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", v.user_id)
        .single();
      if (p) setProfileName(p.full_name);

      // Get signed URLs (5 min expiry)
      const [cedula, selfie] = await Promise.all([
        supabase.storage.from("verifications").createSignedUrl(v.cedula_url, 300),
        supabase.storage.from("verifications").createSignedUrl(v.selfie_url, 300),
      ]);
      if (cedula.data) setCedulaUrl(cedula.data.signedUrl);
      if (selfie.data) setSelfieUrl(selfie.data.signedUrl);

      setLoading(false);
    }
    load();
  }, [id, supabase]);

  async function handleDecision(decision: "approved" | "rejected") {
    if (!verification) return;
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    // Update verification record
    await supabase
      .from("verifications")
      .update({
        admin_decision: decision,
        admin_notes: notes || null,
        admin_id: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", verification.id);

    // Update profile status
    await supabase
      .from("profiles")
      .update({
        verification_status: decision === "approved" ? "verified" : "rejected",
      })
      .eq("user_id", verification.user_id);

    // Notify user
    await supabase.rpc("create_notification", {
      p_user_id: verification.user_id,
      p_title: decision === "approved" ? "Identidad verificada" : "Verificación rechazada",
      p_message: decision === "approved"
        ? "Tu identidad fue verificada exitosamente."
        : `Tu verificación fue rechazada. ${notes || "Intentá con fotos más claras."}`,
      p_type: "verification",
      p_link: "/verificar",
    });

    setSubmitting(false);
    router.push("/admin/verificaciones");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!verification) {
    return <p className="py-8 text-center text-muted-foreground">Verificación no encontrada.</p>;
  }

  const alreadyReviewed = !!verification.admin_decision;

  return (
    <div>
      <Link href="/admin/verificaciones" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Volver
      </Link>

      <div className="mt-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{profileName || "Usuario"}</h2>
            <p className="text-sm text-muted-foreground">
              Enviado {format(new Date(verification.created_at), "d MMM yyyy, HH:mm", { locale: es })}
            </p>
          </div>
          <Badge variant={
            verification.ai_result === "match" ? "default" :
            verification.ai_result === "no_match" ? "destructive" : "secondary"
          }>
            AI: {verification.ai_result} ({((verification.ai_confidence ?? 0) * 100).toFixed(0)}%)
          </Badge>
        </div>

        {/* Images side by side */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="p-2">
              <p className="mb-2 text-center text-xs font-medium text-muted-foreground">Cédula</p>
              {cedulaUrl ? (
                <img src={cedulaUrl} alt="Cédula" className="w-full rounded-lg object-contain" />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                  No disponible
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2">
              <p className="mb-2 text-center text-xs font-medium text-muted-foreground">Selfie</p>
              {selfieUrl ? (
                <img src={selfieUrl} alt="Selfie" className="w-full rounded-lg object-contain" />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                  No disponible
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI reasoning */}
        {verification.ai_reasoning && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground">Razonamiento AI</p>
              <p className="mt-1 text-sm">{verification.ai_reasoning}</p>
            </CardContent>
          </Card>
        )}

        {/* Admin actions */}
        {alreadyReviewed ? (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm">
                <Badge variant={verification.admin_decision === "approved" ? "default" : "destructive"}>
                  {verification.admin_decision === "approved" ? "Aprobado" : "Rechazado"} por admin
                </Badge>
                {verification.admin_notes && (
                  <span className="ml-2 text-muted-foreground">— {verification.admin_notes}</span>
                )}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notas (opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Motivo del rechazo u observaciones..."
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  rows={2}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleDecision("approved")}
                  disabled={submitting}
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Aprobar
                </Button>
                <Button
                  onClick={() => handleDecision("rejected")}
                  disabled={submitting}
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Rechazar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
