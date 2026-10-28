// Guarda el email y lo da de alta en MailerLite si la persona ha dado su permiso.
// El resultado del test es un dato de salud (art. 9 RGPD): solo se guarda y se envía
// a MailerLite con su consentimiento explícito (healthConsent). Las respuestas nunca se guardan.
// Secretos opcionales (Supabase → Edge Functions → Secrets):
//   MAILERLITE_API_KEY, MAILERLITE_GROUP_ID
import { createClient } from "npm:@supabase/supabase-js@2.49.1";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const QUIZ_NAMES: Record<string, string> = {
  descarga: "Hambre de descarga",
  consuelo: "Hambre de consuelo",
  aburrimiento: "Hambre de aburrimiento",
  nocturna: "Hambre nocturna",
};
const QUIZ_TYPES = Object.keys(QUIZ_NAMES);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

async function addToMailerLite(email: string, quizType: string | null) {
  const apiKey = Deno.env.get("MAILERLITE_API_KEY");
  if (!apiKey) return false;

  const groupId = Deno.env.get("MAILERLITE_GROUP_ID");
  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      email,
      fields: { tipo_hambre: quizType ? QUIZ_NAMES[quizType] : "" },
      groups: groupId ? [groupId] : [],
    }),
  });
  if (!res.ok) console.error("MailerLite:", res.status, await res.text());
  return res.ok;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let body: { email?: string; quizType?: string; consent?: boolean; healthConsent?: boolean };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Datos no válidos" }, 400);
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "Email no válido" }, 400);
  }
  const consent = body.consent === true;
  // El resultado solo sirve para personalizar los emails: sin permiso para emails, no se guarda
  const healthConsent = consent && body.healthConsent === true;
  const quizType = healthConsent && QUIZ_TYPES.includes(String(body.quizType)) ? String(body.quizType) : null;
  const now = new Date().toISOString();

  const { error } = await supabase.from("leads").upsert(
    {
      email,
      quiz_type: quizType,
      consent,
      consent_at: consent ? now : null,
      health_consent: healthConsent,
      health_consent_at: healthConsent ? now : null,
    },
    { onConflict: "email" },
  );
  if (error) {
    console.error("No se pudo guardar el contacto:", error);
    return json({ error: "No se pudo guardar" }, 500);
  }

  if (consent) {
    const synced = await addToMailerLite(email, quizType);
    if (synced) {
      await supabase.from("leads").update({ synced_to_mailer: true }).eq("email", email);
    }
  }

  return json({ ok: true });
});
