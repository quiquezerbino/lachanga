import type { Metadata } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Clock, MessageSquareText, Zap, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { JsonLd } from "@/components/json-ld";
import { createClient } from "@/lib/supabase/server";
import { TaskFilters } from "./_components/task-filters";

export const metadata: Metadata = {
  title: "Explorar tareas",
  description:
    "Explorá tareas disponibles en Uruguay. Encontrá trabajos de limpieza, mudanzas, electricidad, plomería, pintura y más en La Changa.",
  alternates: { canonical: "https://lachanga.uy/explorar" },
};

const ITEMS_PER_PAGE = 12;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Explorar tareas en La Changa",
  description: "Listado de tareas y servicios disponibles en Uruguay.",
  url: "https://lachanga.uy/explorar",
};

interface SearchParams {
  q?: string;
  categoria?: string;
  departamento?: string;
  tipo?: string;
  pagina?: string;
}

export default async function ExplorarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || "";
  const categoria = params.categoria || "";
  const departamento = params.departamento || "";
  const tipo = params.tipo || "";
  const page = Math.max(1, Number(params.pagina) || 1);

  const supabase = await createClient();

  // Build query — fetch open tasks with offer counts
  let query = supabase
    .from("tasks")
    .select("*, offers(count)", { count: "exact" })
    .eq("suspended", false)
    .in("status", ["open", "assigned"])
    .order("created_at", { ascending: false })
    .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

  if (q) {
    const safeQ = q.replace(/[,()%]/g, " ").trim().slice(0, 100);
    if (safeQ) {
      query = query.or(`title.ilike.%${safeQ}%,description.ilike.%${safeQ}%`);
    }
  }
  if (categoria) {
    query = query.eq("category", categoria);
  }
  if (departamento) {
    query = query.eq("department", departamento);
  }
  if (tipo === "presencial" || tipo === "remota") {
    query = query.eq("task_type", tipo);
  }

  const { data: tasks, count: totalCount } = await query;

  const total = totalCount ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Explorar tareas</h1>
          <p className="mt-2 text-muted-foreground">
            Encontrá tareas disponibles cerca tuyo y empezá a ganar plata.
          </p>

          {/* Filters (client component) */}
          <div className="mt-8">
            <TaskFilters />
          </div>

          {/* Results count */}
          <p className="mt-6 text-sm text-muted-foreground">
            {total === 0
              ? "No se encontraron tareas"
              : total === 1
                ? "1 tarea encontrada"
                : `${total} tareas encontradas`}
          </p>

          {/* Task grid */}
          {tasks && tasks.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => {
                const currencySymbol = task.currency === "UYU" ? "$" : "US$";
                const offersArr = (task as Record<string, unknown>).offers;
                const offerCount =
                  Array.isArray(offersArr) && offersArr.length > 0
                    ? (offersArr[0] as { count: number }).count
                    : 0;

                return (
                  <Link key={task.id} href={`/tarea/${task.id}`} className="group">
                    <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                      <CardContent className="flex h-full flex-col p-5">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="secondary" className="text-xs">
                            {task.category}
                          </Badge>
                          {task.urgency === "urgente" && (
                            <Badge variant="destructive" className="text-xs">
                              <Zap className="mr-0.5 h-3 w-3" /> URGENTE
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {task.task_type === "presencial" ? "Presencial" : "Remota"}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                          {task.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {task.description}
                        </p>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Location + time */}
                        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {task.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDistanceToNow(new Date(task.created_at), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </span>
                        </div>

                        {/* Budget + offers */}
                        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                          <span className="text-base font-bold tabular-nums text-accent">
                            {currencySymbol}{" "}
                            {Number(task.budget).toLocaleString("es-UY")}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquareText className="h-3.5 w-3.5" />
                            {offerCount}{" "}
                            {offerCount === 1 ? "oferta" : "ofertas"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <SearchX className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                No hay tareas disponibles
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {q || categoria || departamento || tipo
                  ? "Probá cambiando los filtros o ampliando tu búsqueda."
                  : "Todavía no hay tareas publicadas. ¡Sé el primero!"}
              </p>
              <div className="mt-6 flex gap-3">
                {(q || categoria || departamento || tipo) && (
                  <Link
                    href="/explorar"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Limpiar filtros
                  </Link>
                )}
                <Link href="/publicar" className={buttonVariants()}>
                  Publicar tarea
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2">
              {page > 1 && (
                <PaginationLink
                  page={page - 1}
                  params={params}
                  label="← Anterior"
                />
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                )
                .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1)
                    acc.push("ellipsis");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "ellipsis" ? (
                    <span
                      key={`e${i}`}
                      className="px-1 text-muted-foreground"
                    >
                      ...
                    </span>
                  ) : (
                    <PaginationLink
                      key={item}
                      page={item}
                      params={params}
                      label={String(item)}
                      active={item === page}
                    />
                  )
                )}
              {page < totalPages && (
                <PaginationLink
                  page={page + 1}
                  params={params}
                  label="Siguiente →"
                />
              )}
            </nav>
          )}

          {/* CTA for taskers */}
          {total > 0 && (
            <div className="mt-12 rounded-xl border bg-card p-6 text-center sm:p-8">
              <h2 className="text-lg font-bold">¿Sos profesional?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Registrate como Tasker y empezá a recibir ofertas de trabajo.
              </p>
              <Link
                href="/registro?role=tasker"
                className={buttonVariants({ className: "mt-4 font-semibold" })}
              >
                Empezar a ganar
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ── Pagination link ───────────────────────────────────── */

function PaginationLink({
  page,
  params,
  label,
  active,
}: {
  page: number;
  params: SearchParams;
  label: string;
  active?: boolean;
}) {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.categoria) sp.set("categoria", params.categoria);
  if (params.departamento) sp.set("departamento", params.departamento);
  if (params.tipo) sp.set("tipo", params.tipo);
  if (page > 1) sp.set("pagina", String(page));

  const href = `/explorar${sp.toString() ? `?${sp.toString()}` : ""}`;

  return (
    <Link
      href={href}
      className={
        active
          ? "flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground"
          : "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      }
    >
      {label}
    </Link>
  );
}
