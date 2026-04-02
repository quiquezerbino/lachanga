import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Centro de ayuda",
  description:
    "Preguntas frecuentes sobre La Changa. Aprendé cómo publicar tareas, registrarte como Tasker, y más.",
  alternates: { canonical: "https://lachanga.uy/ayuda" },
};

const faqs = [
  {
    q: "¿Cómo publico una tarea?",
    a: "Hacé click en 'Publicar tarea', describí lo que necesitás, indicá tu zona y presupuesto. En minutos empezás a recibir ofertas de profesionales.",
  },
  {
    q: "¿Cuánto cuesta publicar?",
    a: "Publicar tareas es 100% gratis para los clientes. Solo pagás el monto que acordás con el Tasker que elijas.",
  },
  {
    q: "¿Cómo me registro como Tasker?",
    a: "Hacé click en 'Ganá plata haciendo changas', completá tu perfil con tus habilidades y zona de trabajo. Una vez aprobado, podés empezar a postularte a tareas.",
  },
  {
    q: "¿Cómo funciona el pago?",
    a: "Los pagos se procesan a través de MercadoPago. El dinero queda protegido hasta que el cliente confirma que el trabajo fue completado satisfactoriamente.",
  },
  {
    q: "¿En qué zonas está disponible La Changa?",
    a: "La Changa opera en todo Uruguay. Actualmente tenemos mayor concentración de profesionales en Montevideo y el área metropolitana, pero estamos creciendo rápidamente.",
  },
  {
    q: "¿Qué pasa si no estoy conforme con el trabajo?",
    a: "Si el trabajo no cumple con lo acordado, podés abrir una disputa antes de liberar el pago. Nuestro equipo de soporte media para encontrar una solución justa.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AyudaPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Centro de ayuda</h1>
          <p className="mt-2 text-muted-foreground">
            Respuestas a las preguntas más frecuentes.
          </p>

          <div className="mt-12 space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold">{faq.q}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
