"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { ClipboardList, MessageSquare, User } from "lucide-react";

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">
        ¡Hola{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
      </h1>
      <p className="mt-1 text-muted-foreground">
        Bienvenido a tu panel de La Changa
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Link
          href="/publicar"
          className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center transition-shadow hover:shadow-md"
        >
          <ClipboardList className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Publicar tarea</h3>
          <p className="text-sm text-muted-foreground">
            Describí lo que necesitás
          </p>
        </Link>

        <Link
          href="/mensajes"
          className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center transition-shadow hover:shadow-md"
        >
          <MessageSquare className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Mensajes</h3>
          <p className="text-sm text-muted-foreground">
            Conversá con tus Taskers
          </p>
        </Link>

        <Link
          href={`/perfil/${profile?.user_id || ""}`}
          className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center transition-shadow hover:shadow-md"
        >
          <User className="h-8 w-8 text-primary" />
          <h3 className="font-semibold">Mi perfil</h3>
          <p className="text-sm text-muted-foreground">
            Editá tu información
          </p>
        </Link>
      </div>
    </div>
  );
}
