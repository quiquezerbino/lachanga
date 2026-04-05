import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil de profesional",
  description: "Mirá el perfil, valoraciones y trabajos completados de este profesional en La Changa.",
};

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return children;
}
