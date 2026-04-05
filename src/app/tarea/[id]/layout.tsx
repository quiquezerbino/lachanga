import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle de tarea",
  description: "Mirá los detalles de esta tarea y hacé tu oferta en La Changa.",
};

export default function TareaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
