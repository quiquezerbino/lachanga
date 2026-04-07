/**
 * Fix Supabase Auth Configuration
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx npx tsx scripts/fix-supabase-auth.ts
 *
 * Get your access token from:
 *   https://supabase.com/dashboard/account/tokens
 */

const PROJECT_REF = "wsgvlqcdvdtiybhygiim";
const API_BASE = "https://api.supabase.com/v1";

const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.error(`
❌ Missing SUPABASE_ACCESS_TOKEN

Steps:
1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Name it "lachanga-setup" and copy the token
4. Run: SUPABASE_ACCESS_TOKEN=sbp_xxx npx tsx scripts/fix-supabase-auth.ts
`);
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

async function updateAuthConfig() {
  console.log("🔧 Updating Supabase Auth configuration...\n");

  // 1. Update Site URL and Redirect URLs
  const authConfig = {
    site_url: "https://lachanga.uy",
    uri_allow_list: [
      "https://lachanga.uy/**",
      "http://localhost:3000/**",
    ].join(","),
    mailer_subjects_confirmation: "Confirmá tu cuenta en La Changa",
    mailer_subjects_recovery: "Recuperá tu contraseña - La Changa",
    mailer_subjects_magic_link: "Tu enlace de acceso - La Changa",
    mailer_subjects_email_change: "Confirmá tu nuevo email - La Changa",
    mailer_subjects_invite: "Te invitaron a La Changa",
    mailer_templates_confirmation_content: `<h2 style="color: #1e3a5f; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">¡Bienvenido/a a La Changa!</h2>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Hacé clic en el siguiente enlace para confirmar tu cuenta:</p>
<p style="margin: 24px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #1e3a5f; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600;">
    Confirmar mi cuenta
  </a>
</p>
<p style="color: #666; font-size: 14px; font-family: Arial, sans-serif;">Si no creaste esta cuenta, podés ignorar este email.</p>
<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
<p style="color: #999; font-size: 12px; font-family: Arial, sans-serif;">— El equipo de <strong>La Changa</strong> | <a href="https://lachanga.uy" style="color: #3b82f6;">lachanga.uy</a></p>`,
    mailer_templates_recovery_content: `<h2 style="color: #1e3a5f; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Recuperá tu contraseña</h2>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
<p style="margin: 24px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #1e3a5f; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600;">
    Restablecer contraseña
  </a>
</p>
<p style="color: #666; font-size: 14px; font-family: Arial, sans-serif;">Si no pediste esto, podés ignorar este email. Tu contraseña no cambiará.</p>
<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
<p style="color: #999; font-size: 12px; font-family: Arial, sans-serif;">— El equipo de <strong>La Changa</strong> | <a href="https://lachanga.uy" style="color: #3b82f6;">lachanga.uy</a></p>`,
    mailer_templates_magic_link_content: `<h2 style="color: #1e3a5f; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Tu enlace de acceso</h2>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Hacé clic en el siguiente enlace para iniciar sesión:</p>
<p style="margin: 24px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #1e3a5f; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600;">
    Iniciar sesión
  </a>
</p>
<p style="color: #666; font-size: 14px; font-family: Arial, sans-serif;">Si no pediste este enlace, podés ignorar este email.</p>
<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
<p style="color: #999; font-size: 12px; font-family: Arial, sans-serif;">— El equipo de <strong>La Changa</strong> | <a href="https://lachanga.uy" style="color: #3b82f6;">lachanga.uy</a></p>`,
    mailer_templates_email_change_content: `<h2 style="color: #1e3a5f; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Confirmá tu nuevo email</h2>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Hacé clic en el siguiente enlace para confirmar tu nuevo email:</p>
<p style="margin: 24px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #1e3a5f; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600;">
    Confirmar nuevo email
  </a>
</p>
<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
<p style="color: #999; font-size: 12px; font-family: Arial, sans-serif;">— El equipo de <strong>La Changa</strong> | <a href="https://lachanga.uy" style="color: #3b82f6;">lachanga.uy</a></p>`,
    mailer_templates_invite_content: `<h2 style="color: #1e3a5f; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Te invitaron a La Changa</h2>
<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">Hacé clic en el siguiente enlace para aceptar la invitación:</p>
<p style="margin: 24px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #1e3a5f; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600;">
    Aceptar invitación
  </a>
</p>
<hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
<p style="color: #999; font-size: 12px; font-family: Arial, sans-serif;">— El equipo de <strong>La Changa</strong> | <a href="https://lachanga.uy" style="color: #3b82f6;">lachanga.uy</a></p>`,
  };

  const res = await fetch(`${API_BASE}/projects/${PROJECT_REF}/config/auth`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(authConfig),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ Failed (${res.status}):`, text);
    return false;
  }

  console.log("✅ Site URL → https://lachanga.uy");
  console.log("✅ Redirect URLs → lachanga.uy/** + localhost:3000/**");
  console.log("✅ Email subjects en español con branding La Changa");
  console.log("✅ Email templates HTML personalizados (5 templates)");
  return true;
}

async function verifyConfig() {
  console.log("\n🔍 Verificando configuración...\n");

  const res = await fetch(`${API_BASE}/projects/${PROJECT_REF}/config/auth`, {
    headers,
  });

  if (!res.ok) {
    console.error("❌ No se pudo verificar");
    return;
  }

  const config = await res.json();
  console.log(`  Site URL: ${config.site_url}`);
  console.log(`  Redirect URLs: ${config.uri_allow_list}`);
  console.log(`  Confirm subject: ${config.mailer_subjects_confirmation}`);
  console.log(`  Recovery subject: ${config.mailer_subjects_recovery}`);
}

async function main() {
  const ok = await updateAuthConfig();
  if (ok) {
    await verifyConfig();
    console.log("\n🎉 ¡Todo listo! Los próximos emails de registro vendrán con branding de La Changa");
    console.log("   y los links redirigirán a https://lachanga.uy");
  }
}

main().catch(console.error);
