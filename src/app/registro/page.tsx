"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTAMENTOS } from "@/lib/constants";
import { MailCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistroForm />
    </Suspense>
  );
}

function RegistroForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "tasker" ? "tasker" : "client";

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [role, setRole] = useState<"client" | "tasker">(initialRole);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departamento) {
      setError("Elegí un departamento");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nombre, role, department: departamento },
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">¡Revisá tu email!</h1>
        <p className="mt-3 text-muted-foreground">
          Te enviamos un correo a{" "}
          <span className="font-medium text-foreground">{email}</span>. Hacé
          click en el enlace de confirmación para activar tu cuenta.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Si no lo ves, revisá tu carpeta de spam.
        </p>
        <Link href="/login" className={buttonVariants({ variant: "outline", className: "mt-8" })}>
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:py-24">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Unite a la comunidad de La Changa
      </p>

      {/* Role selector */}
      <div className="mt-6 flex rounded-lg border p-1">
        <button
          type="button"
          onClick={() => setRole("client")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
            role === "client"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Busco ayuda
        </button>
        <button
          type="button"
          onClick={() => setRole("tasker")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
            role === "tasker"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Quiero ganar plata
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Juan Pérez"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-email">Email</Label>
          <Input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-password">Contraseña</Label>
          <Input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>
        <div className="space-y-2">
          <Label>Departamento</Label>
          <Select value={departamento} onValueChange={(v) => { if (v) setDepartamento(v); }}>
            <SelectTrigger>
              <SelectValue placeholder="Elegí tu departamento" />
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full font-semibold" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}
