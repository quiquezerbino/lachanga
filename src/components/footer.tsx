import Link from "next/link";

const footerSections = [
  {
    title: "Navegación",
    links: [
      { href: "/explorar", label: "Buscar tareas" },
      { href: "/como-funciona", label: "Cómo funciona" },
      { href: "/publicar", label: "Publicar tarea" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terminos", label: "Términos y condiciones" },
      { href: "/privacidad", label: "Política de privacidad" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { href: "/ayuda", label: "Centro de ayuda" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <svg
                viewBox="0 0 40 40"
                className="h-7 w-7 text-primary"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" />
                <path
                  d="M12 20l5 5 11-11"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-lg font-bold">La Changa</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              La forma más fácil de conseguir ayuda en Uruguay.
            </p>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold">{section.title}</h4>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} La Changa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
