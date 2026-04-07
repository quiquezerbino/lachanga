import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Shield, Users, Home } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: isAdmin } = await supabase.rpc("is_admin", { p_user_id: user.id });

  if (!isAdmin) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-2 border-b pb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold">Panel de Administración</h1>
      </div>
      <div className="mt-4 flex gap-6">
        <nav className="hidden w-48 shrink-0 space-y-1 sm:block">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Home className="h-4 w-4" /> Dashboard
          </Link>
          <Link
            href="/admin/verificaciones"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Users className="h-4 w-4" /> Verificaciones
          </Link>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
