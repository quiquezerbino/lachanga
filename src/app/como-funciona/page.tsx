import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { JsonLd } from "@/components/json-ld";
import { ArrowRight, ClipboardList, DollarSign, Users, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "Publicá tu tarea en La Changa, recibí ofertas de profesionales verificados, elegí al mejor y pagá seguro con MercadoPago. Así de fácil.",
  alternates: { canonical: "https://lachanga.uy/como-funciona" },
};

const clientSteps = [
  {
    icon: ClipboardList,
    title: "1. Publicá tu tarea",
    description:
      "Describí lo que necesitás, en qué zona y cuánto estás dispuesto a pagar. Es gratis y toma menos de 2 minutos.",
  },
  {
    icon: Users,
    title: "2. Recibí ofertas",
    description:
      "Profesionales verificados te envían sus propuestas. Compará perfiles, reseñas y precios.",
  },
  {
    icon: ShieldCheck,
    title: "3. Elegí y pagá seguro",
    description:
      "Seleccioná al mejor Tasker y pagá con MercadoPago. Tu dinero está protegido hasta que el trabajo esté listo.",
  },
];

const taskerSteps = [
  {
    icon: Users,
    title: "1. Creá tu perfil",
    description:
      "Registrate gratis, completá tu perfil con tus habilidades y zona de trabajo.",
  },
  {
    icon: ClipboardList,
    title: "2. Postulate a tareas",
    description:
      "Explorá las tareas disponibles en tu zona y enviá tus ofertas con tu precio.",
  },
  {
    icon: DollarSign,
    title: "3. Hacé el trabajo y cobrá",
    description:
      "Completá la tarea, recibí tu valoración y cobrá directo a tu cuenta de MercadoPago.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo usar La Changa para contratar servicios en Uruguay",
  description:
    "Guía paso a paso para publicar una tarea y contratar profesionales verificados en Uruguay.",
  step: clientSteps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title.replace(/^\d+\.\s/, ""),
    text: s.description,
  })),
};

export default function ComoFunciona() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-4xl font-bold">¿Cómo funciona La Changa?</h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Ya seas cliente o profesional, empezar es simple.
          </p>

          {/* Para clientes */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold">Para clientes</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {clientSteps.map((step) => (
                <div key={step.title} className="rounded-xl border bg-card p-6">
                  <step.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/publicar" className={buttonVariants()}>
                Publicar mi tarea <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Para taskers */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold">Para Taskers</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {taskerSteps.map((step) => (
                <div key={step.title} className="rounded-xl border bg-card p-6">
                  <step.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/registro?role=tasker"
                className={buttonVariants({ variant: "outline" })}
              >
                Registrarme como Tasker <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
