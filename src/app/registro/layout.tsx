import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Registrate en La Changa como cliente o profesional. Publicá tareas gratis o ganá plata haciendo changas en Uruguay.",
};

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
