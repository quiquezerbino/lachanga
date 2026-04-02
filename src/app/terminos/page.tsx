import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso de La Changa, marketplace de servicios profesionales en Uruguay.",
  alternates: { canonical: "https://lachanga.uy/terminos" },
};

export default function TerminosPage() {
  return (
    <section className="py-16">
      <div className="prose prose-slate mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1>Términos y condiciones</h1>
        <p className="lead">Última actualización: abril 2026</p>

        <h2>1. Aceptación de los términos</h2>
        <p>
          Al acceder y utilizar La Changa (lachanga.uy), aceptás estos términos y
          condiciones en su totalidad. Si no estás de acuerdo con alguno de estos
          términos, no debés utilizar la plataforma.
        </p>

        <h2>2. Descripción del servicio</h2>
        <p>
          La Changa es un marketplace que conecta personas que necesitan servicios
          profesionales con proveedores de dichos servicios en Uruguay. La Changa
          actúa únicamente como intermediario y no es parte de la relación
          contractual entre clientes y Taskers.
        </p>

        <h2>3. Registro y cuenta</h2>
        <p>
          Para utilizar ciertos servicios de la plataforma, debés crear una cuenta
          proporcionando información veraz y actualizada. Sos responsable de
          mantener la confidencialidad de tus credenciales de acceso.
        </p>

        <h2>4. Publicación de tareas</h2>
        <p>
          Los clientes pueden publicar tareas describiendo el servicio que
          necesitan. Las publicaciones deben ser claras, verídicas y no deben
          contener contenido ilegal, ofensivo o engañoso.
        </p>

        <h2>5. Taskers</h2>
        <p>
          Los Taskers son profesionales independientes que ofrecen sus servicios a
          través de la plataforma. La Changa no emplea, supervisa ni controla a
          los Taskers. Cada Tasker es responsable de la calidad de su trabajo y
          del cumplimiento de las normativas aplicables.
        </p>

        <h2>6. Pagos y comisiones</h2>
        <p>
          Los pagos se procesan a través de MercadoPago. La Changa cobra una
          comisión sobre cada transacción completada. Los detalles de las
          comisiones se informan al momento de la transacción.
        </p>

        <h2>7. Limitación de responsabilidad</h2>
        <p>
          La Changa no garantiza la calidad, seguridad o legalidad de los
          servicios ofrecidos por los Taskers. La plataforma proporciona
          herramientas para facilitar la conexión, pero la responsabilidad del
          servicio recae en el Tasker y el cliente.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Para consultas sobre estos términos, podés contactarnos en
          hola@lachanga.uy.
        </p>
      </div>
    </section>
  );
}
