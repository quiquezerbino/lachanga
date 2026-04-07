"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile } from "@/components/turnstile";
import { CheckCircle } from "lucide-react";

export function ContactForm() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: integrate with email API or Supabase when ready
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-semibold">Mensaje enviado</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Te respondemos lo antes posible. Gracias por contactarnos.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="text-sm font-medium">
          Nombre
        </label>
        <Input id="name" placeholder="Tu nombre" className="mt-1" required />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" type="email" placeholder="tu@email.com" className="mt-1" required />
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
          required
          minLength={10}
        />
      </div>
      <Turnstile
        onSuccess={(token) => setCaptchaToken(token)}
        onError={() => setCaptchaToken(null)}
        onExpire={() => setCaptchaToken(null)}
      />
      <Button type="submit" disabled={!captchaToken && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}>
        Enviar mensaje
      </Button>
    </form>
  );
}
