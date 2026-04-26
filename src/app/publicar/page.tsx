"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import { DEPARTAMENTOS, CATEGORIES } from "@/lib/constants";
import { ShieldAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import Link from "next/link";

type TaskType = "presencial" | "remota";
type Currency = "UYU" | "USD";
type Urgency = "normal" | "urgente";

interface FormData {
  title: string;
  category: string;
  description: string;
  department: string;
  neighborhood: string;
  taskType: TaskType;
  currency: Currency;
  budget: string;
  deadline: string;
  flexible: boolean;
  urgency: Urgency;
}

const initialForm: FormData = {
  title: "",
  category: "",
  description: "",
  department: "",
  neighborhood: "",
  taskType: "presencial",
  currency: "UYU",
  budget: "",
  deadline: "",
  flexible: false,
  urgency: "normal",
};

export default function PublicarTareaPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canGoStep2 =
    form.title.length >= 3 &&
    form.category &&
    form.description.length >= 20 &&
    form.department;

  const canGoStep3 = form.budget && Number(form.budget) > 0;

  const handlePublish = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: form.title,
      description: form.description,
      category: form.category,
      department: form.department,
      neighborhood: form.neighborhood || null,
      task_type: form.taskType,
      currency: form.currency,
      budget: Number(form.budget),
      deadline: form.flexible ? null : form.deadline || null,
      urgency: form.urgency,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  const currencySymbol = form.currency === "UYU" ? "$" : "US$";

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // Gate: must be logged in and verified to publish
  if (!authLoading && !user) return null;

  if (!authLoading && user && profile?.verification_status !== "verified") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
        <ShieldAlert className="h-16 w-16 text-amber-500" />
        <h1 className="mt-6 text-2xl font-bold">Verificá tu identidad</h1>
        <p className="mt-2 text-muted-foreground">
          Para publicar tareas necesitás verificar tu identidad primero.
        </p>
        <Link href="/verificar" className={buttonVariants({ className: "mt-8 font-semibold" })}>
          Verificar identidad
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      {/* Progress */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-16",
                  step > s ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Describí tu tarea */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Describí tu tarea</h2>

          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={form.title}
              onChange={(e) => update("title", e.target.value.slice(0, 80))}
              placeholder="Ej: Arreglar canilla del baño"
              maxLength={80}
            />
            <p className="text-xs text-muted-foreground">
              {form.title.length}/80
            </p>
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select
              value={form.category}
              onValueChange={(v) => { if (v) update("category", v); }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Elegí una categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describí con detalle qué necesitás (mínimo 20 caracteres)"
              rows={4}
            />
            <p
              className={cn(
                "text-xs",
                form.description.length < 20
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {form.description.length}/20 mín.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select
                value={form.department}
                onValueChange={(v) => { if (v) update("department", v); }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTAMENTOS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Barrio / Ciudad</Label>
              <Input
                value={form.neighborhood}
                onChange={(e) => update("neighborhood", e.target.value)}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="flex gap-2">
              {(["presencial", "remota"] as TaskType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update("taskType", t)}
                  className={cn(
                    "flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition",
                    form.taskType === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "presencial" ? "Presencial" : "Remota / Online"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!canGoStep2}>
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Presupuesto y fecha */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Presupuesto y fecha</h2>

          <div className="space-y-2">
            <Label>Moneda</Label>
            <div className="flex gap-2">
              {(["UYU", "USD"] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update("currency", c)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition",
                    form.currency === c
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c === "UYU" ? "$ UYU" : "US$ USD"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Presupuesto</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {currencySymbol}
              </span>
              <Input
                type="number"
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
                placeholder="0"
                className="pl-10 tabular-nums"
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fecha límite</Label>
            <div className="flex items-center gap-3">
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => update("deadline", e.target.value)}
                disabled={form.flexible}
                min={new Date().toISOString().split("T")[0]}
                className="w-[200px]"
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.flexible}
                  onChange={(e) => {
                    update("flexible", e.target.checked);
                    if (e.target.checked) update("deadline", "");
                  }}
                  className="rounded border-border"
                />
                Flexible
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Urgencia</Label>
            <div className="flex gap-2">
              {(["normal", "urgente"] as Urgency[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => update("urgency", u)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition",
                    form.urgency === u
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {u === "urgente" && (
                    <Badge variant="destructive" className="text-xs">
                      URGENTE
                    </Badge>
                  )}
                  {u === "normal" ? "Normal" : "Urgente"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canGoStep3}>
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Revisión */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Revisión</h2>
          <div className="space-y-4 rounded-xl border bg-card p-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Título</p>
              <p className="font-medium">{form.title}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Categoría
                </p>
                <Badge variant="secondary">{form.category}</Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Tipo</p>
                <p>
                  {form.taskType === "presencial" ? "Presencial" : "Remota"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Descripción
              </p>
              <p className="text-sm">{form.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Ubicación
                </p>
                <p>
                  {form.department}
                  {form.neighborhood ? `, ${form.neighborhood}` : ""}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Presupuesto
                </p>
                <p className="text-lg font-bold tabular-nums text-accent">
                  {currencySymbol}{" "}
                  {Number(form.budget).toLocaleString("es-UY")}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Fecha límite
                </p>
                <p>
                  {form.flexible
                    ? "Flexible"
                    : form.deadline || "Sin fecha"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Urgencia
                </p>
                {form.urgency === "urgente" ? (
                  <Badge variant="destructive">URGENTE</Badge>
                ) : (
                  <p>Normal</p>
                )}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
            </Button>
            <Button
              onClick={handlePublish}
              disabled={loading}
              className="font-semibold"
            >
              {loading ? "Publicando..." : "Publicar tarea"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
