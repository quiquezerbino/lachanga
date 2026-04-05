import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publicar tarea",
  description:
    "Publicá gratis lo que necesitás resolver y recibí ofertas de profesionales verificados en Uruguay.",
};

export default function PublicarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
