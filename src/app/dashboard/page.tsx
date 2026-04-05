"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { taskStatusLabel } from "@/lib/status-labels";
import type { Tables } from "@/lib/supabase/types";
import {
  ClipboardList,
  MessageSquare,
  User,
  Plus,
  MapPin,
  Clock,
  Inbox,
  DollarSign,
} from "lucide-react";

type Task = Tables<"tasks">;
type Offer = Tables<"offers"> & { tasks?: { title: string; currency: string } | null };

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);

    const [tasksRes, offersRes] = await Promise.all([
      // My published tasks (as client)
      supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      // My offers (as tasker)
      supabase
        .from("offers")
        .select("*, tasks(title, currency)")
        .eq("tasker_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    setMyTasks(tasksRes.data || []);
    setMyOffers((offersRes.data as Offer[]) || []);
    setLoadingData(false);
  }, [user, supabase]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  if (loading || loadingData) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted" />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isTasker = profile?.role === "tasker";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            ¡Hola{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Tu panel de La Changa
          </p>
        </div>
        <Link href="/publicar" className={buttonVariants({ className: "gap-2 font-semibold" })}>
          <Plus className="h-4 w-4" /> Publicar tarea
        </Link>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/publicar"
          className="flex items-center gap-3 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Publicar tarea</h3>
            <p className="text-xs text-muted-foreground">Describí lo que necesitás</p>
          </div>
        </Link>
        <Link
          href="/mensajes"
          className="flex items-center gap-3 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Mensajes</h3>
            <p className="text-xs text-muted-foreground">Conversá con tus Taskers</p>
          </div>
        </Link>
        <Link
          href={`/perfil/${profile?.user_id || ""}`}
          className="flex items-center gap-3 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Mi perfil</h3>
            <p className="text-xs text-muted-foreground">Editá tu información</p>
          </div>
        </Link>
      </div>

      {/* My published tasks */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Mis tareas publicadas</h2>
          <span className="text-sm text-muted-foreground">{myTasks.length} total</span>
        </div>

        {myTasks.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-xl border bg-card py-10 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-2 text-sm text-muted-foreground">
              No publicaste ninguna tarea todavía
            </p>
            <Link href="/publicar" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
              Publicar mi primera tarea
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {myTasks.map((task) => {
              const cs = task.currency === "UYU" ? "$" : "US$";
              return (
                <Link key={task.id} href={`/tarea/${task.id}`} className="group block">
                  <Card className="transition-all group-hover:shadow-md">
                    <CardContent className="flex flex-wrap items-center gap-4 p-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold group-hover:text-primary">
                            {task.title}
                          </h3>
                          <Badge
                            variant={task.status === "open" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {taskStatusLabel[task.status] || task.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {task.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(task.created_at), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </span>
                        </div>
                      </div>
                      <span className="text-base font-bold tabular-nums text-accent">
                        {cs} {Number(task.budget).toLocaleString("es-UY")}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* My offers (tasker view) */}
      {isTasker && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Mis ofertas enviadas</h2>
            <span className="text-sm text-muted-foreground">{myOffers.length} total</span>
          </div>

          {myOffers.length === 0 ? (
            <div className="mt-4 flex flex-col items-center rounded-xl border bg-card py-10 text-center">
              <DollarSign className="h-10 w-10 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">
                No hiciste ninguna oferta todavía
              </p>
              <Link href="/explorar" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
                Explorar tareas
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {myOffers.map((offer) => {
                const cs = offer.currency === "UYU" ? "$" : "US$";
                return (
                  <Link key={offer.id} href={`/tarea/${offer.task_id}`} className="group block">
                    <Card className="transition-all group-hover:shadow-md">
                      <CardContent className="flex flex-wrap items-center gap-4 p-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold group-hover:text-primary">
                            {offer.tasks?.title || "Tarea"}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant={offer.status === "accepted" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {offer.status === "pending" ? "Pendiente" :
                               offer.status === "accepted" ? "Aceptada" :
                               offer.status === "rejected" ? "Rechazada" : offer.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(offer.created_at), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </span>
                          </div>
                        </div>
                        <span className="text-base font-bold tabular-nums text-accent">
                          {cs} {Number(offer.price).toLocaleString("es-UY")}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
