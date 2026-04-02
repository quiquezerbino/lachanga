import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Explorar tareas",
  description:
    "Explorá tareas disponibles en Uruguay. Encontrá trabajos de limpieza, mudanzas, electricidad, plomería, pintura y más en La Changa.",
  alternates: { canonical: "https://lachanga.uy/explorar" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Explorar tareas en La Changa",
  description: "Listado de tareas y servicios disponibles en Uruguay.",
  url: "https://lachanga.uy/explorar",
};

export default function ExplorarPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Explorar tareas</h1>
          <p className="mt-2 text-muted-foreground">
            Encontrá tareas disponibles cerca tuyo y empezá a ganar plata.
          </p>

          {/* Search */}
          <div className="mt-8 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar tareas..." className="pl-10" />
            </div>
            <Button>Buscar</Button>
          </div>

          {/* Placeholder for tasks — will connect to Supabase */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="mt-3 h-3 w-full rounded bg-muted" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-3 w-20 rounded bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Próximamente: tareas reales de profesionales en tu zona.{" "}
            <Link href="/registro?role=tasker" className="text-primary underline">
              Registrate como Tasker
            </Link>{" "}
            para ser de los primeros.
          </p>
        </div>
      </section>
    </>
  );
}
