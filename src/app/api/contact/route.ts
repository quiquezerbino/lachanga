import { NextResponse } from "next/server";
import { Resend } from "resend";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // si no está configurado, lo dejamos pasar (dev)
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiados mensajes. Intentá de nuevo en una hora." },
        { status: 429 }
      );
    }

    const { name, email, message, captchaToken } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    if (typeof name !== "string" || name.length > 120) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }
    if (typeof email !== "string" || email.length > 200) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }
    if (typeof message !== "string" || message.length < 10 || message.length > 5000) {
      return NextResponse.json({ error: "El mensaje debe tener entre 10 y 5000 caracteres" }, { status: 400 });
    }

    if (captchaToken) {
      const valid = await verifyTurnstile(captchaToken);
      if (!valid) {
        return NextResponse.json({ error: "Verificación de captcha fallida" }, { status: 400 });
      }
    } else if (process.env.TURNSTILE_SECRET_KEY) {
      return NextResponse.json({ error: "Verificación de captcha requerida" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 });
    }

    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "La Changa <hola@lachanga.uy>",
      to: "hola@lachanga.uy",
      replyTo: email,
      subject: `[La Changa] Contacto de ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        <hr />
        <p style="color: #888; font-size: 12px;">Enviado desde lachanga.uy/contacto</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Error enviando mensaje" }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
