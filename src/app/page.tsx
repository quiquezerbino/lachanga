import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { JsonLd } from "@/components/json-ld";
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
      <section className="bg-gradient-to-b from-background to-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Resolvé lo que necesites
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Publicá tu tarea, elegí al mejor, y listo. La forma más fácil de
            conseguir ayuda en Uruguay.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/publicar" className={buttonVariants({ size: "lg" })}>
              Publicar tarea gratis <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/registro?role=tasker"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Ganá plata haciendo changas
            </Link>
          </div>

          {/* Value props — real, not fake stats */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {valueProps.map((prop) => (
              <div
                key={prop.title}
                className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 shadow-sm"
              >
                <prop.icon className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">{prop.title}</h3>
                <p className="text-sm text-muted-foreground">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">¿Cómo funciona?</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/publicar" className={buttonVariants()}>
              Publicar tarea
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section id="categorias" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">Categorías populares</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/explorar?categoria=${cat.slug}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-4">
                    <cat.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Taskers */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Sé tu propio jefe</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Registrate como Tasker y empezá a ganar plata haciendo lo que sabés.
          </p>
          <ul className="mx-auto mt-8 max-w-md space-y-3 text-left text-sm">
            <li className="flex items-start gap-2">
              <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              Elegí tus horarios y zonas de trabajo
            </li>
            <li className="flex items-start gap-2">
              <DollarSign className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              Poné tus propios precios
            </li>
            <li className="flex items-start gap-2">
              <ClipboardList className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              Construí tu reputación con reseñas reales
            </li>
          </ul>
          <div className="mt-8">
            <Link
              href="/registro?role=tasker"
              className={buttonVariants({ size: "lg" })}
            >
              Registrate como Tasker <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
