import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mensajes",
  description: "Conversá con tus clientes o profesionales en La Changa.",
  robots: { index: false },
};

export default function MensajesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
