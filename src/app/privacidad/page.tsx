import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de La Changa. Cómo recopilamos, usamos y protegemos tus datos personales.",
  alternates: { canonical: "https://lachanga.uy/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <section className="py-16">
      <div className="prose prose-slate mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1>Política de privacidad</h1>
        <p className="lead">Última actualización: abril 2026</p>

        <h2>1. Información que recopilamos</h2>
        <p>
          Recopilamos información que nos proporcionás directamente al crear tu
          cuenta: nombre, email, teléfono y zona de trabajo. También recopilamos
          información de uso de la plataforma de forma automática.
        </p>

        <h2>2. Uso de la información</h2>
        <p>Utilizamos tu información para:</p>
        <ul>
          <li>Gestionar tu cuenta y proporcionarte nuestros servicios</li>
          <li>Conectar clientes con Taskers en su zona</li>
          <li>Procesar pagos a través de MercadoPago</li>
          <li>Enviarte notificaciones sobre tareas y ofertas</li>
          <li>Mejorar la plataforma y tu experiencia de uso</li>
        </ul>

        <h2>3. Protección de datos</h2>
        <p>
          Implementamos medidas de seguridad técnicas y organizativas para
          proteger tu información personal, en cumplimiento con la Ley 18.331
          de Protección de Datos Personales de Uruguay.
        </p>

        <h2>4. Compartir información</h2>
        <p>
          No vendemos tu información personal. Compartimos datos limitados
          únicamente cuando es necesario para prestar el servicio (por ejemplo,
          compartir tu nombre y zona con un Tasker al que contratás).
        </p>

        <h2>5. Tus derechos</h2>
        <p>
          Tenés derecho a acceder, rectificar y eliminar tus datos personales
          en cualquier momento. Para ejercer estos derechos, contactanos en
          hola@lachanga.uy.
        </p>

        <h2>6. Cookies</h2>
        <p>
          Utilizamos cookies esenciales para el funcionamiento de la plataforma
          y cookies analíticas para mejorar nuestro servicio. Podés gestionar
          tus preferencias de cookies en la configuración de tu navegador.
        </p>

        <h2>7. Contacto</h2>
        <p>
          Para consultas sobre privacidad: hola@lachanga.uy
        </p>
      </div>
    </section>
  );
}
