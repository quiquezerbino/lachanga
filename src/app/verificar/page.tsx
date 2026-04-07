"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Clock, ShieldX, ShieldAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { VerificationUpload, VerificationResult } from "@/components/verification-upload";

export default function VerificarPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [verificationResult, setVerificationResult] = useState<{
    result: string;
    status: string;
    reasoning: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const status = profile.verification_status;

  // Already verified
  if (status === "verified") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
        <ShieldCheck className="h-16 w-16 text-accent" />
        <h1 className="mt-6 text-2xl font-bold">Identidad verificada</h1>
        <p className="mt-2 text-muted-foreground">
          Tu identidad ya fue verificada. Tu perfil muestra el badge de verificado.
        </p>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "mt-8" })}>
          Volver al dashboard
        </Link>
      </div>
    );
  }

  // Pending review
  if (status === "pending" && !verificationResult) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
        <Clock className="h-16 w-16 text-amber-500" />
        <h1 className="mt-6 text-2xl font-bold">Verificación en revisión</h1>
        <p className="mt-2 text-muted-foreground">
          Tu verificación está siendo revisada por nuestro equipo. Te notificaremos cuando esté lista.
        </p>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "mt-8" })}>
          Volver al dashboard
        </Link>
      </div>
    );
  }

  // Show result after submission
  if (verificationResult) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <VerificationResult {...verificationResult} />
        <div className="mt-8 text-center">
          <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Upload form (unverified or rejected)
  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <div className="text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Verificá tu identidad</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Para generar confianza en la comunidad, necesitamos verificar tu identidad.
          Subí una foto de tu cédula y una selfie.
        </p>
      </div>

      {status === "rejected" && (
        <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
          <ShieldX className="mx-auto h-6 w-6 text-destructive" />
          <p className="mt-2 text-sm text-destructive">
            Tu verificación anterior fue rechazada. Intentá con fotos más claras.
          </p>
        </div>
      )}

      <div className="mt-8">
        <VerificationUpload userId={user.id} onComplete={setVerificationResult} />
      </div>
    </div>
  );
}
