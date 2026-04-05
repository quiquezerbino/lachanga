import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi panel",
  description: "Administrá tus tareas, mensajes y perfil en La Changa.",
  robots: { index: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
