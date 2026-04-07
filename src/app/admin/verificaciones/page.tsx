import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default async function VerificacionesPage() {
  const supabase = await createClient();

  const { data: verifications } = await supabase
    .from("verifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // Get profiles for all user_ids
  const userIds = [...new Set((verifications || []).map((v) => v.user_id))];
  const { data: profiles } = userIds.length > 0
    ? await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds)
    : { data: [] };

  const profileMap = new Map((profiles || []).map((p) => [p.user_id, p.full_name]));

  const statusIcon = (v: { ai_result: string; admin_decision: string | null }) => {
    if (v.admin_decision === "approved") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (v.admin_decision === "rejected") return <XCircle className="h-4 w-4 text-destructive" />;
    if (v.ai_result === "match") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (v.ai_result === "no_match") return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-amber-500" />;
  };

  const statusLabel = (v: { ai_result: string; admin_decision: string | null }) => {
    if (v.admin_decision === "approved") return "Aprobado (admin)";
    if (v.admin_decision === "rejected") return "Rechazado (admin)";
    if (v.ai_result === "match") return "Match (AI)";
    if (v.ai_result === "no_match") return "No match (AI)";
    return "Pendiente revisión";
  };

  const pendingCount = (verifications || []).filter(
    (v) => v.ai_result === "unclear" && !v.admin_decision
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Verificaciones</h2>
        {pendingCount > 0 && (
          <Badge variant="destructive">{pendingCount} pendientes</Badge>
        )}
      </div>

      {!verifications || verifications.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">No hay verificaciones todavía.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {verifications.map((v) => (
            <Link key={v.id} href={`/admin/verificaciones/${v.id}`} className="group block">
              <Card className="transition-all group-hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  {statusIcon(v)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium group-hover:text-primary">
                      {profileMap.get(v.user_id) || "Usuario"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(v.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                      {v.ai_reasoning && ` — ${v.ai_reasoning.substring(0, 80)}...`}
                    </p>
                  </div>
                  <Badge variant={
                    v.ai_result === "unclear" && !v.admin_decision ? "destructive" : "secondary"
                  } className="text-xs">
                    {statusLabel(v)}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
