"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile } from "@/components/turnstile";
import { CheckCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, captchaToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error enviando mensaje");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
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
        <Input id="name" name="name" placeholder="Tu nombre" className="mt-1" required />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" name="email" type="email" placeholder="tu@email.com" className="mt-1" required />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Mensaje
        </label>
        <Textarea
          id="message"
          name="message"
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

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading || (!captchaToken && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar mensaje"
        )}
      </Button>
    </form>
  );
}
