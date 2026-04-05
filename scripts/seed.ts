/**
 * Seed script: inserts sample tasks into Supabase.
 *
 * Usage:  npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (service role key bypasses RLS so we can insert without auth).
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "❌  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const SAMPLE_TASKS = [
  {
    title: "Limpieza profunda de apartamento 2 dormitorios",
    description:
      "Necesito una limpieza completa de un apartamento de 2 dormitorios en Pocitos. Incluye cocina, baño, pisos y ventanas. El apartamento tiene aproximadamente 70m2. Preferiblemente un día de semana por la mañana.",
    category: "Limpieza del hogar",
    department: "Montevideo",
    neighborhood: "Pocitos",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 3500,
    urgency: "normal" as const,
  },
  {
    title: "Mudanza de monoambiente Cordón → Malvín",
    description:
      "Mudanza de un monoambiente. Tengo una cama, un escritorio, un sillón, varias cajas con ropa y cosas de cocina. No hay ascensor en el edificio de origen (3er piso). El destino tiene ascensor. Fecha flexible dentro de las próximas 2 semanas.",
    category: "Mudanzas y fletes",
    department: "Montevideo",
    neighborhood: "Cordón",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 5000,
    urgency: "normal" as const,
  },
  {
    title: "Instalación de 3 luces LED en living",
    description:
      "Tengo 3 plafones LED comprados que necesito instalar en el living comedor. Ya están las bocas de luz en el techo, solo hay que conectar. El trabajo incluye verificar que la instalación eléctrica aguante y dejar todo funcionando.",
    category: "Electricidad",
    department: "Montevideo",
    neighborhood: "Parque Rodó",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 2000,
    urgency: "normal" as const,
  },
  {
    title: "Arreglar pérdida en canilla de cocina",
    description:
      "La canilla de la cocina gotea constantemente. Necesito un plomero que revise si es el cuerito o si hay que cambiar la grifería completa. Tengo fotos disponibles. Preferiblemente con disponibilidad esta semana.",
    category: "Plomería / Sanitaria",
    department: "Montevideo",
    neighborhood: "Centro",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 1500,
    urgency: "urgente" as const,
  },
  {
    title: "Pintar habitación de 4x4m",
    description:
      "Necesito pintar una habitación de aproximadamente 4x4 metros. Son las 4 paredes y el techo. Color blanco (tengo la pintura comprada, son 2 baldes de 20 litros). El piso es parquet, hay que protegerlo bien.",
    category: "Pintura",
    department: "Canelones",
    neighborhood: "Ciudad de la Costa",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 4000,
    urgency: "normal" as const,
  },
  {
    title: "Diseño de logo para emprendimiento de comida",
    description:
      "Necesito un logo profesional para mi emprendimiento de comida saludable. Quiero algo moderno, minimalista, que transmita frescura. Me gustaría recibir propuestas con al menos 3 opciones diferentes y los archivos finales en formato vectorial.",
    category: "Diseño gráfico",
    department: "Montevideo",
    task_type: "remota" as const,
    currency: "USD" as const,
    budget: 80,
    urgency: "normal" as const,
  },
  {
    title: "Landing page para estudio de abogados",
    description:
      "Necesito una landing page profesional para un estudio jurídico. Debe tener: página de inicio con servicios, formulario de contacto, sección de equipo con fotos, y un blog básico. Preferiblemente en Next.js o WordPress. Diseño sobrio y profesional.",
    category: "Desarrollo web",
    department: "Montevideo",
    task_type: "remota" as const,
    currency: "USD" as const,
    budget: 350,
    urgency: "normal" as const,
  },
  {
    title: "Corte de pasto y poda de cerco en Carrasco",
    description:
      "Tengo un jardín de aproximadamente 200m2 que necesita corte de pasto y una poda del cerco perimetral (ligustro, unos 30 metros lineales). Traer sus propias herramientas. El trabajo debería tomar medio día.",
    category: "Jardinería",
    department: "Montevideo",
    neighborhood: "Carrasco",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 3000,
    urgency: "normal" as const,
  },
  {
    title: "Armado de escritorio y biblioteca IKEA",
    description:
      "Compré un escritorio y una biblioteca que necesitan armado. Son muebles estilo IKEA (de Bazar Luz). Tengo las instrucciones y todas las piezas. Necesito alguien con experiencia y herramientas propias.",
    category: "Armado de muebles",
    department: "Montevideo",
    neighborhood: "Buceo",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 2500,
    urgency: "normal" as const,
  },
  {
    title: "Clases de matemáticas para liceo (3er año)",
    description:
      "Busco profesor/a particular de matemáticas para mi hijo de 3er año de liceo. Necesita refuerzo en álgebra y geometría. Preferiblemente 2 clases por semana de 1 hora. Puede ser presencial en Pocitos o por Zoom.",
    category: "Clases particulares",
    department: "Montevideo",
    neighborhood: "Pocitos",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 800,
    urgency: "normal" as const,
  },
  {
    title: "Gestión de habilitación comercial en IMM",
    description:
      "Necesito ayuda para tramitar la habilitación comercial de un local gastronómico en la Intendencia de Montevideo. El local está en Ciudad Vieja. Busco alguien que conozca los trámites y pueda agilizar el proceso.",
    category: "Trámites y gestiones",
    department: "Montevideo",
    neighborhood: "Ciudad Vieja",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 6000,
    urgency: "urgente" as const,
  },
  {
    title: "Reparar cerradura de puerta principal",
    description:
      "La cerradura de la puerta de entrada del apartamento no funciona bien, cuesta mucho girar la llave. Necesito un cerrajero que la revise y arregle o reemplace. Es una cerradura de seguridad multipunto.",
    category: "Reparaciones del hogar",
    department: "Maldonado",
    neighborhood: "Punta del Este",
    task_type: "presencial" as const,
    currency: "UYU" as const,
    budget: 2000,
    urgency: "urgente" as const,
  },
];

async function seed() {
  // First we need a user to own the tasks.
  // We'll look for any existing user, or create a demo one.
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id")
    .limit(1);

  let userId: string;

  if (profiles && profiles.length > 0) {
    userId = profiles[0].user_id;
    console.log(`Using existing user: ${userId}`);
  } else {
    // Create a demo user via auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: "demo@lachanga.uy",
      password: "demo123456",
      email_confirm: true,
      user_metadata: { full_name: "Demo User", role: "client", department: "Montevideo" },
    });
    if (authError) {
      console.error("❌  Error creating demo user:", authError.message);
      process.exit(1);
    }
    userId = authUser.user.id;
    console.log(`Created demo user: ${userId}`);
  }

  // Insert tasks
  const tasksToInsert = SAMPLE_TASKS.map((t) => ({
    ...t,
    user_id: userId,
    status: "open" as const,
    suspended: false,
  }));

  const { data, error } = await supabase.from("tasks").insert(tasksToInsert).select("id, title");

  if (error) {
    console.error("❌  Error inserting tasks:", error.message);
    process.exit(1);
  }

  console.log(`\n✅  Inserted ${data.length} sample tasks:\n`);
  data.forEach((t) => console.log(`  • ${t.title}`));
  console.log("\nDone! Visit /explorar to see them.\n");
}

seed();
