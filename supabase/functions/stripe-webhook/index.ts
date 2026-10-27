// Recibe el aviso de Stripe cuando alguien paga y desbloquea su cuenta.
// Secretos necesarios (Supabase → Edge Functions → Secrets):
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secretKey || !webhookSecret) {
    console.error("Faltan los secretos STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET");
    return new Response("Stripe sin configurar", { status: 500 });
  }
  const stripe = new Stripe(secretKey, { httpClient: Stripe.createFetchHttpClient() });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Falta la firma", { status: 400 });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await req.text(),
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error("Firma no válida:", err);
    return new Response("Firma no válida", { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (session.payment_status !== "paid") {
      return new Response("Pago pendiente", { status: 200 });
    }
    if (!userId) {
      console.error("Pago sin usuaria asociada:", session.id);
      return new Response("Sin usuaria", { status: 200 });
    }

    const { error } = await supabase.from("purchases").upsert({
      user_id: userId,
      stripe_session_id: session.id,
      email: session.customer_details?.email ?? null,
      amount_total: session.amount_total,
      currency: session.currency,
    });

    if (error) {
      console.error("No se pudo guardar la compra:", error);
      // 500 hace que Stripe reintente el aviso más tarde
      return new Response("Error al guardar", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
