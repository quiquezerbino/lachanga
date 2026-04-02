import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá al equipo de La Changa. Estamos para ayudarte con cualquier consulta sobre la plataforma.",
  alternates: { canonical: "https://lachanga.uy/contacto" },
};

export default function ContactoPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Contacto</h1>
        <p className="mt-2 text-muted-foreground">
          ¿Tenés alguna consulta? Escribinos y te respondemos lo antes posible.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Nombre
              </label>
              <Input id="name" placeholder="Tu nombre" className="mt-1" />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="tu@email.com" className="mt-1" />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium">
                Mensaje
              </label>
              <Textarea
                id="message"
                placeholder="¿En qué te podemos ayudar?"
                rows={5}
                className="mt-1"
              />
            </div>
            <Button type="submit">Enviar mensaje</Button>
          </form>

          {/* Info */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">hola@lachanga.uy</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Redes sociales</h3>
                <p className="text-sm text-muted-foreground">
                  Seguinos en Instagram: @lachanga.uy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
