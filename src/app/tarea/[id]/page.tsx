"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, MapPin, Clock, Star, Send, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button-variants";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import { taskStatusLabel } from "@/lib/status-labels";
import type { Tables } from "@/lib/supabase/types";

type Task = Tables<"tasks">;
type Profile = Tables<"profiles">;
type Offer = Tables<"offers"> & { profile?: Profile | null };

export default function DetalleTareaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, profile: myProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [task, setTask] = useState<Task | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerDays, setOfferDays] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data: t } = await supabase.from("tasks").select("*").eq("id", id).single();
      setTask(t);

      if (t) {
        const { data: p } = await supabase.from("profiles").select("*").eq("user_id", t.user_id).single();
        setOwner(p);

        const { data: o } = await supabase.from("offers").select("*").eq("task_id", t.id).order("created_at", { ascending: false });
        if (o && o.length > 0) {
          const taskerIds = [...new Set(o.map((of) => of.tasker_id))];
          const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", taskerIds);
          const profileMap = new Map((profiles || []).map((pr) => [pr.user_id, pr]));
          setOffers(o.map((of) => ({ ...of, profile: profileMap.get(of.tasker_id) || null })));
        }
      }
      setLoading(false);
    };
    fetch();
  }, [id, supabase]);

  const isOwner = user && task && user.id === task.user_id;
  const isTasker = myProfile?.role === "tasker";
  const alreadyOffered = offers.some((o) => o.tasker_id === user?.id);

  const handleSubmitOffer = async () => {
    if (!user || !task) return;
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from("offers").insert({
      task_id: task.id,
      tasker_id: user.id,
      price: Number(offerPrice),
      currency: task.currency,
      message: offerMessage,
      estimated_days: offerDays ? Number(offerDays) : null,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
    } else {
      setOfferPrice("");
      setOfferMessage("");
      setOfferDays("");
      // Refresh offers
      const { data: o } = await supabase.from("offers").select("*").eq("task_id", task.id).order("created_at", { ascending: false });
      if (o) {
        const taskerIds = [...new Set(o.map((of) => of.tasker_id))];
        const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", taskerIds);
        const profileMap = new Map((profiles || []).map((pr) => [pr.user_id, pr]));
        setOffers(o.map((of) => ({ ...of, profile: profileMap.get(of.tasker_id) || null })));
      }
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />)}
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-medium">Tarea no encontrada</p>
        <Link href="/explorar" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Link>
      </div>
    );
  }

  const currencySymbol = task.currency === "UYU" ? "$" : "US$";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link href="/explorar" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a tareas
      </Link>

      {/* Task detail */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{task.category}</Badge>
          {task.urgency === "urgente" && <Badge variant="destructive">URGENTE</Badge>}
          <Badge variant="outline" className="text-xs">
            {task.task_type === "presencial" ? "Presencial" : "Remota"}
          </Badge>
        </div>

        <h1 className="mt-3 text-2xl font-bold">{task.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {task.department}
            {task.neighborhood ? `, ${task.neighborhood}` : ""}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />{" "}
            {formatDistanceToNow(new Date(task.created_at), { addSuffix: true, locale: es })}
          </span>
        </div>

        <p className="mt-4 whitespace-pre-wrap leading-relaxed">{task.description}</p>

        <div className="mt-6 grid gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Presupuesto</p>
            <p className="text-xl font-bold tabular-nums text-accent">
              {currencySymbol} {Number(task.budget).toLocaleString("es-UY")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fecha límite</p>
            <p className="font-medium">
              {task.deadline ? format(new Date(task.deadline), "dd/MM/yyyy") : "Flexible"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estado</p>
            <Badge variant={task.status === "open" ? "default" : "secondary"}>
              {taskStatusLabel[task.status] || task.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Owner */}
      {owner && (
        <Link
          href={`/perfil/${owner.user_id}`}
          className="mt-6 block rounded-xl border bg-card p-5 transition hover:shadow-md"
        >
          <h3 className="text-sm font-semibold">Publicado por</h3>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {owner.full_name?.charAt(0)?.toUpperCase() || "?"}
            </span>
            <div>
              <p className="font-medium">{owner.full_name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{owner.department}</span>
                {owner.rating && Number(owner.rating) > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-current text-amber-500" /> {Number(owner.rating).toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Offers */}
      <div className="mt-6">
        <h3 className="text-lg font-bold">
          Ofertas {offers.length > 0 && `(${offers.length})`}
        </h3>
        {offers.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Todavía no hay ofertas para esta tarea.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {offer.profile?.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                    <div>
                      <Link href={`/perfil/${offer.tasker_id}`} className="text-sm font-medium hover:text-primary">
                        {offer.profile?.full_name || "Tasker"}
                      </Link>
                      {offer.profile?.rating && Number(offer.profile.rating) > 0 && (
                        <div className="flex items-center gap-0.5 text-xs">
                          <Star className="h-3 w-3 fill-current text-amber-500" />
                          {Number(offer.profile.rating).toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold tabular-nums text-accent">
                      {offer.currency === "UYU" ? "$" : "US$"}{" "}
                      {Number(offer.price).toLocaleString("es-UY")}
                    </p>
                    {offer.estimated_days && (
                      <p className="text-xs text-muted-foreground">
                        {offer.estimated_days} días
                      </p>
                    )}
                  </div>
                </div>
                {offer.message && (
                  <p className="mt-2 text-sm">{offer.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offer form — verification required */}
      {user && isTasker && !isOwner && task.status === "open" && !alreadyOffered && myProfile?.verification_status !== "verified" && (
        <Link
          href="/verificar"
          className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 transition-shadow hover:shadow-md dark:border-amber-900 dark:bg-amber-950/30"
        >
          <ShieldAlert className="h-6 w-6 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Verificá tu identidad para ofertar</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Necesitás verificar tu cédula antes de hacer ofertas</p>
          </div>
        </Link>
      )}

      {user && isTasker && !isOwner && task.status === "open" && !alreadyOffered && myProfile?.verification_status === "verified" && (
        <div className="mt-6 rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold">Hacer una oferta</h3>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Precio propuesto ({task.currency})</Label>
                <Input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="0" min={0} />
              </div>
              <div className="space-y-2">
                <Label>Plazo estimado (días)</Label>
                <Input type="number" value={offerDays} onChange={(e) => setOfferDays(e.target.value)} placeholder="Opcional" min={1} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mensaje</Label>
              <Textarea value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} placeholder="Contale al cliente por qué sos la mejor opción" rows={3} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleSubmitOffer} disabled={submitting || !offerPrice} className="font-semibold">
              <Send className="mr-2 h-4 w-4" /> {submitting ? "Enviando..." : "Enviar oferta"}
            </Button>
          </div>
        </div>
      )}

      {user && isTasker && alreadyOffered && (
        <div className="mt-6 rounded-xl border bg-muted/50 p-5 text-center">
          <p className="text-sm text-muted-foreground">Ya hiciste una oferta para esta tarea.</p>
        </div>
      )}

      {!user && task.status === "open" && (
        <div className="mt-6 rounded-xl border bg-muted/50 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-primary hover:underline">Iniciá sesión</Link>{" "}
            para hacer una oferta
          </p>
        </div>
      )}
    </div>
  );
}
