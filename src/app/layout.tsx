import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lachanga.uy"),
  title: {
    default: "La Changa - Resolvé lo que necesites",
    template: "%s | La Changa",
  },
  description:
    "Publicá tu tarea, elegí al mejor profesional y listo. La plataforma más fácil para conseguir ayuda en Uruguay.",
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "https://lachanga.uy",
    siteName: "La Changa",
    title: "La Changa - Resolvé lo que necesites",
    description:
      "Publicá tu tarea, elegí al mejor profesional y listo. La plataforma más fácil para conseguir ayuda en Uruguay.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "La Changa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Changa - Resolvé lo que necesites",
    description:
      "Publicá tu tarea, elegí al mejor profesional y listo. La plataforma más fácil para conseguir ayuda en Uruguay.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://lachanga.uy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
