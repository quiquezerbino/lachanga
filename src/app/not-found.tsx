import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-7xl font-extrabold tabular-nums text-primary/20 sm:text-9xl">
        404
      </span>
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
        Página no encontrada
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Lo que buscás no existe o fue movido. Probá volver al inicio o explorar
        las tareas disponibles.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className={buttonVariants({ variant: "default", className: "gap-2" })}
        >
          <Home className="h-4 w-4" /> Ir al inicio
        </Link>
        <Link
          href="/explorar"
          className={buttonVariants({ variant: "outline", className: "gap-2" })}
        >
          <Search className="h-4 w-4" /> Explorar tareas
        </Link>
      </div>
    </div>
  );
}
