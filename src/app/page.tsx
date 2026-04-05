import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "La Changa - Resolvé lo que necesites | Marketplace de servicios en Uruguay",
  description:
    "Publicá tu tarea, elegí al mejor profesional y listo. Limpieza, mudanzas, electricidad, plomería y más. La plataforma más fácil para conseguir ayuda en Uruguay.",
  alternates: { canonical: "https://lachanga.uy" },
};
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  UserCheck,
  ClipboardList,
  DollarSign,
  Star,
  Paintbrush,
  Truck,
  Zap,
  Wrench,
  Flower2,
  Sofa,
  Pencil,
  Code,
  Home,
  GraduationCap,
  FileText,
  Droplets,
} from "lucide-react";

const categories = [
  { name: "Limpieza del hogar", icon: Home, slug: "limpieza" },
  { name: "Mudanzas y fletes", icon: Truck, slug: "mudanzas" },
  { name: "Electricidad", icon: Zap, slug: "electricidad" },
  { name: "Plomería / Sanitaria", icon: Droplets, slug: "plomeria" },
  { name: "Pintura", icon: Paintbrush, slug: "pintura" },
  { name: "Jardinería", icon: Flower2, slug: "jardineria" },
  { name: "Armado de muebles", icon: Sofa, slug: "muebles" },
  { name: "Diseño gráfico", icon: Pencil, slug: "diseno" },
  { name: "Desarrollo web", icon: Code, slug: "desarrollo" },
  { name: "Reparaciones del hogar", icon: Wrench, slug: "reparaciones" },
  { name: "Clases particulares", icon: GraduationCap, slug: "clases" },
  { name: "Trámites y gestiones", icon: FileText, slug: "tramites" },
];

const steps = [
  {
    number: "1",
    title: "Describí lo que necesitás",
    description: "Contanos qué tarea precisás resolver y en qué zona.",
  },
  {
    number: "2",
    title: "Poné tu presupuesto",
    description: "Indicá cuánto estás dispuesto a pagar por el trabajo.",
  },
  {
    number: "3",
    title: "Recibí ofertas y elegí al mejor",
    description: "Compará perfiles, valoraciones y elegí tu Tasker ideal.",
  },
];

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Sin comisión para clientes",
    description: "Publicá gratis, pagá solo lo que acordás con tu Tasker.",
  },
  {
    icon: CreditCard,
    title: "Pago seguro",
    description: "MercadoPago protege tu dinero hasta que el trabajo esté listo.",
  },
  {
    icon: UserCheck,
    title: "Profesionales verificados",
    description: "Perfiles con reseñas reales de otros clientes.",
  },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: "La Changa",
      url: "https://lachanga.uy",
      description:
        "Marketplace de servicios profesionales en Uruguay. Publicá tu tarea, elegí al mejor profesional, y resolvé lo que necesitás.",
      areaServed: { "@type": "Country", name: "Uruguay" },
      serviceType: "Marketplace de servicios profesionales",
      knowsLanguage: "es",
    },
    {
      "@type": "WebSite",
      name: "La Changa",
      url: "https://lachanga.uy",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://lachanga.uy/explorar?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cómo funciona La Changa?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Publicás tu tarea describiendo lo que necesitás, recibís ofertas de profesionales verificados, elegís al mejor según perfil y valoraciones, y pagás de forma segura por MercadoPago.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto cuesta usar La Changa?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Publicar tareas es gratis para los clientes. Solo pagás el monto que acordás con el profesional. La Changa cobra una comisión al Tasker por cada trabajo completado.",
          },
        },
        {
          "@type": "Question",
          name: "¿En qué zonas opera La Changa?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La Changa opera en todo Uruguay, con mayor concentración de profesionales en Montevideo y el área metropolitana.",
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={jsonLdData} />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              style={{ letterSpacing: "-0.04em" }}
            >
              Resolvé lo que necesites
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground sm:mt-6 sm:text-xl">
              Publicá tu tarea, elegí al mejor, y listo. La forma más fácil de
              conseguir ayuda en Uruguay.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/publicar"
                className={buttonVariants({ size: "lg", className: "gap-2 px-6 text-base font-semibold shadow-sm" })}
              >
                Publicar tarea gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/registro?role=tasker"
                className={buttonVariants({ variant: "outline", size: "lg", className: "px-6 text-base font-semibold" })}
              >
                Ganá plata haciendo changas
              </Link>
            </div>
          </div>

          {/* Value props */}
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:mt-16 sm:grid-cols-3">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <prop.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{prop.title}</h3>
                <p className="text-sm text-muted-foreground">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-card py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            ¿Cómo funciona?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-12">
            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {i === 0 ? (
                    <ClipboardList className="h-7 w-7" />
                  ) : i === 1 ? (
                    <DollarSign className="h-7 w-7" />
                  ) : (
                    <UserCheck className="h-7 w-7" />
                  )}
                </div>
                <span className="mt-2 text-xs font-semibold text-accent tabular-nums">
                  Paso {step.number}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/publicar"
              className={buttonVariants({ size: "lg", className: "font-semibold shadow-sm" })}
            >
              Publicar tarea
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section id="categorias" className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Categorías populares
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/explorar?categoria=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <cat.icon className="h-8 w-8 text-accent transition-colors group-hover:text-primary" />
                <span className="text-sm font-medium text-foreground">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Taskers — fondo azul oscuro */}
      <section className="bg-primary py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              Sé tu propio jefe
            </h2>
            <p className="mt-3 text-base leading-relaxed text-primary-foreground/80">
              Unite a miles de Taskers que ya ganan plata haciendo lo que saben.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Star className="h-5 w-5" />
                <span className="text-sm font-medium">Elegí tus horarios</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium">Poné tu precio</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <ClipboardList className="h-5 w-5" />
                <span className="text-sm font-medium">Trabajá en lo que te gusta</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/registro?role=tasker"
                className={buttonVariants({ variant: "secondary", size: "lg", className: "font-semibold shadow-sm" })}
              >
                Empezar a ganar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
