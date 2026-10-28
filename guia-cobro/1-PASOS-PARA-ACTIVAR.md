# CalmaComida · Pasos para activar el cobro

Lo técnico ya está hecho. Estos pasos son los que necesitan tus cuentas.
Hazlos en orden. Todo se prueba primero en **modo de prueba** (sin dinero real).

> **Nunca pegues claves secretas en el chat.** Donde ponga "secreto", cópialo directamente de Stripe/MailerLite a Supabase.

---

## Paso 1 · Subir los audios de pago a Supabase (5 min)

1. Entra en <https://supabase.com/dashboard> → proyecto **calmacomida**.
2. Menú izquierdo → **Storage** → abre el almacenamiento **premium**.
3. Pulsa **Upload files** y elige los **10 archivos** de la carpeta `audios-de-pago` (dentro de la carpeta calmacomida de tu Escritorio).
4. Comprueba que aparecen los 10, con estos nombres exactos:
   `module-2.mp3` … `module-7.mp3`, `module-4-daily.mp3`, `module-6-daily.mp3`, `module-7-daily.mp3`, `cierre-mantenimiento.mp3`

## Paso 2 · Ajustar las cuentas de usuaria en Supabase (2 min)

1. Menú izquierdo → **Authentication** → **Sign In / Providers** → **Email**.
2. Desactiva **Confirm email** y guarda.
   *(Supabase solo puede enviar unos pocos emails de confirmación por hora con su servidor gratuito. Más adelante, con dominio propio, lo podemos volver a activar.)*

## Paso 3 · Stripe en modo de prueba (15 min)

1. Crea tu cuenta en <https://stripe.com> (de momento no hace falta terminar la verificación para probar).
2. Arriba, activa **Modo de prueba** / *Test mode*.
3. **Producto:** *Catálogo de productos* → **Añadir producto**
   - Nombre: `CalmaComida · Programa completo`
   - Precio: `47,00 €`, **pago único** (no recurrente)
4. **Enlace de pago:** *Payment Links* → **Crear enlace** con ese producto.
   - En **Después del pago** elige **No mostrar página de confirmación → Redirigir a tu web** y pon:
     `http://localhost:8765/?pago=ok` *(dirección de pruebas en tu ordenador; la cambiaremos al publicar. Si Stripe no la acepta, pon `https://joseppp7.github.io/calmacomida/docs/?pago=ok` y avísame)*
   - Crea el enlace y **copia su URL** (empieza por `https://buy.stripe.com/test_…`). Esta **no es secreta**: pásamela por el chat y la pongo en la app.
5. **Aviso de pago (webhook):** *Desarrolladores* → **Webhooks** → **Añadir destino / endpoint**
   - URL: `https://annwqcfehdvuhhcqfeix.supabase.co/functions/v1/stripe-webhook`
   - Eventos: `checkout.session.completed` y `checkout.session.async_payment_succeeded`
   - Al crearlo verás un **Secreto de firma** (`whsec_…`). Es **secreto**.
6. **Clave secreta:** *Desarrolladores* → **Claves de API** → **Clave secreta** (`sk_test_…`). Es **secreta**.

## Paso 4 · Guardar los secretos de Stripe en Supabase (3 min)

1. Supabase → **Edge Functions** → **Secrets** (o *Project Settings → Edge Functions*).
2. Añade dos secretos:
   | Nombre | Valor |
   |---|---|
   | `STRIPE_SECRET_KEY` | la clave `sk_test_…` |
   | `STRIPE_WEBHOOK_SECRET` | el secreto `whsec_…` |
3. Guarda.

**Avísame cuando estén los pasos 1–4** y me pases el enlace de pago: lo conecto y hacemos una compra de prueba con la tarjeta `4242 4242 4242 4242` (cualquier fecha futura y cualquier CVC).

## Paso 5 · MailerLite para los emails automáticos (30 min)

1. Crea tu cuenta gratis en <https://www.mailerlite.com> y verifica tu email de remitente.
2. **Subscribers → Groups** → crea el grupo `Test hambre emocional`.
3. **Subscribers → Fields** → crea el campo de texto `tipo_hambre`.
4. **Automations** → nueva automatización:
   - Disparador: *When subscriber joins a group* → `Test hambre emocional`
   - Pasos: email del día 0 → esperar 1 día → email del día 1 → … (los textos están en `2-EMAILS.md`)
   - En los emails puedes escribir `{$tipo_hambre}` y se sustituye por su resultado, p. ej. "Hambre de descarga".
5. **Integrations → API** → genera una clave (**secreta**). Para saber el ID del grupo, abre el grupo: es el número largo de la dirección de la página.
6. En Supabase → Edge Functions → Secrets, añade:
   | Nombre | Valor |
   |---|---|
   | `MAILERLITE_API_KEY` | la clave de la API |
   | `MAILERLITE_GROUP_ID` | el número del grupo |

## Paso 6 · Antes de vender de verdad (lo vemos juntos)

- [ ] Revisar los textos del test (`docs/data.js`, apartado *quiz*) con tu criterio profesional.
- [ ] Completar y revisar la página de privacidad (`docs/privacidad.html`) y añadir condiciones de compra.
- [ ] Quitar o sustituir los testimonios si no son reales y con permiso.
- [ ] Poner tu email de contacto en `supportEmail` (`docs/data.js`).
- [ ] Conectar un servicio de envío de emails (p. ej. Resend, gratis hasta 3.000 al mes) en Supabase → Authentication → Emails → SMTP. Sin esto, el email de «¿Olvidaste tu contraseña?» solo llega a ti, no a las clientas.
- [ ] Crear cuenta en Cloudflare para publicar la nueva versión y poner el repositorio de GitHub en privado (los audios de pago siguen en versiones antiguas del repositorio público).
- [ ] Activar Stripe en modo real (verificación de identidad + IBAN), crear el enlace de pago real y cambiarlo en la app.
- [ ] Recomendado: dominio propio (calmacomida.es o similar).
