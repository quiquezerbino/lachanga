import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, Clock, ShieldX } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: pendingVerifications },
    { count: verifiedUsers },
    { count: rejectedVerifications },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("verifications").select("id", { count: "exact", head: true })
      .eq("ai_result", "unclear").is("admin_decision", null),
    supabase.from("profiles").select("id", { count: "exact", head: true })
      .eq("verification_status", "verified"),
    supabase.from("verifications").select("id", { count: "exact", head: true })
      .eq("ai_result", "no_match"),
  ]);

  const stats = [
    { label: "Usuarios totales", value: totalUsers ?? 0, icon: Users, color: "text-primary" },
    { label: "Verificados", value: verifiedUsers ?? 0, icon: ShieldCheck, color: "text-green-500" },
    { label: "Pendientes revisión", value: pendingVerifications ?? 0, icon: Clock, color: "text-amber-500" },
    { label: "Rechazados AI", value: rejectedVerifications ?? 0, icon: ShieldX, color: "text-destructive" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
