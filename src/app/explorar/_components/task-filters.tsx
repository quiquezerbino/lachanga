"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition, Suspense } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CATEGORIES, DEPARTAMENTOS } from "@/lib/constants";

function TaskFiltersInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get("q") || "";
  const currentCategoria = searchParams.get("categoria") || "";
  const currentDepartamento = searchParams.get("departamento") || "";
  const currentTipo = searchParams.get("tipo") || "";

  const [searchInput, setSearchInput] = useState(currentQ);
  const [showFilters, setShowFilters] = useState(
    !!(currentCategoria || currentDepartamento || currentTipo)
  );

  const activeFilterCount = [currentCategoria, currentDepartamento, currentTipo].filter(Boolean).length;

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset to page 1 on filter change
      params.delete("pagina");
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      startTransition(() => {
        router.push(`/explorar?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() });
  };

  const clearAll = () => {
    setSearchInput("");
    startTransition(() => {
      router.push("/explorar");
    });
  };

  const hasAnyFilter = !!(currentQ || currentCategoria || currentDepartamento || currentTipo);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar tareas..."
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Buscar
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowFilters((v) => !v)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </form>

      {/* Filter dropdowns */}
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <Select
            value={currentCategoria}
            onValueChange={(v) => updateParams({ categoria: !v || v === "__all__" ? "" : v })}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todas las categorías</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={currentDepartamento}
            onValueChange={(v) => updateParams({ departamento: !v || v === "__all__" ? "" : v })}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos los departamentos</SelectItem>
              {DEPARTAMENTOS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1.5">
            {(["presencial", "remota"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updateParams({ tipo: currentTipo === t ? "" : t })}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition",
                  currentTipo === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "presencial" ? "Presencial" : "Remota"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filter pills */}
      {hasAnyFilter && (
        <div className="flex flex-wrap items-center gap-2">
          {currentQ && (
            <Badge variant="secondary" className="gap-1">
              Búsqueda: {currentQ}
              <button onClick={() => { setSearchInput(""); updateParams({ q: "" }); }}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentCategoria && (
            <Badge variant="secondary" className="gap-1">
              {currentCategoria}
              <button onClick={() => updateParams({ categoria: "" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentDepartamento && (
            <Badge variant="secondary" className="gap-1">
              {currentDepartamento}
              <button onClick={() => updateParams({ departamento: "" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentTipo && (
            <Badge variant="secondary" className="gap-1">
              {currentTipo === "presencial" ? "Presencial" : "Remota"}
              <button onClick={() => updateParams({ tipo: "" })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
}

export function TaskFilters() {
  return (
    <Suspense>
      <TaskFiltersInner />
    </Suspense>
  );
}
