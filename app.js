// CalmaComida 2026
const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");
const STORAGE_KEY = "calmacomida_v5";

const DEFAULT_STATE = {
  done: {},
  lastTab: "home",
  programStarted: false,
  openModule: null,
  reminderTime: null,   // "HH:MM" o null
  practiceDays: {}      // { "2026-10-27": true } días con práctica diaria hecha
};

// Si el progreso guardado está dañado, empezamos de cero en lugar de romper la app
function loadState() {
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

let state = loadState();

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Pantalla actual, para volver a pintarla cuando cambia la sesión o el acceso
let currentView = () => render(state.lastTab || "home");

// ─── CUENTA Y ACCESO ────────────────────────────────────
// El enlace del email de "olvidé mi contraseña" vuelve con #...type=recovery (o #error=... si caducó).
// Lo leemos antes de crear el cliente, porque Supabase limpia la dirección al procesarla.
const recoveryHash = new URLSearchParams(location.hash.slice(1));
const isPasswordRecovery = recoveryHash.get("type") === "recovery";
const recoveryLinkError = recoveryHash.get("error_code");

// Si la librería no carga (p. ej. sin conexión), la parte gratuita sigue funcionando
const sb =window.supabase ? window.supabase.createClient(APP_DATA.supabaseUrl, APP_DATA.supabaseKey) : null;
let session = null;
let hasAccess = false;

async function refreshAccess() {
  if (!sb) return;
  const { data } = await sb.auth.getSession();
  session = data.session;
  if (!session) { hasAccess = false; return; }
  const { data: access, error } = await sb.rpc("has_access");
  hasAccess = !error && access === true;
}

// Módulo 1: gratis dejando el email (test) o con cuenta. El resto: programa completo.
function isUnlocked(m) {
  if (m.free) return !!(state.leadEmail || session);
  return hasAccess;
}

// Las rutas "premium/..." viven en el almacenamiento privado y necesitan un enlace firmado
const signedUrls = {};
async function resolveAudio(path) {
  if (!path.startsWith("premium/")) return path;
  if (!sb || !hasAccess) return null;
  const file = path.slice("premium/".length);
  const cached = signedUrls[file];
  if (cached && cached.expires > Date.now()) return cached.url;
  const { data, error } = await sb.storage.from("premium").createSignedUrl(file, 3600);
  if (error) { console.error("Audio privado:", error); return null; }
  signedUrls[file] = { url: data.signedUrl, expires: Date.now() + 50 * 60 * 1000 };
  return data.signedUrl;
}

// Rellena los <audio data-audio="..."> de la pantalla actual
function hydrateAudios() {
  document.querySelectorAll("audio[data-audio]").forEach(async el => {
    const url = await resolveAudio(el.dataset.audio);
    if (url) el.src = url;
    else el.insertAdjacentHTML("afterend", `<p class="audio-hint">No se pudo cargar el audio. Revisa tu conexión.</p>`);
  });
}

window.goToPayment = function() {
  if (!session) return renderAccount("signup", true);
  if (!APP_DATA.paymentLink) {
    alert("El pago todavía no está activado. Vuelve a intentarlo en unos días.");
    return;
  }
  const url = new URL(APP_DATA.paymentLink);
  url.searchParams.set("client_reference_id", session.user.id);
  window.location.href = url.toString();
};

window.logout = async function() {
  if (sb) await sb.auth.signOut();
  session = null;
  hasAccess = false;
  setActiveTab("progress");
};

function paywallCard(intro) {
  return `
    <div class="card paywall-card">
      <div class="paywall-lock">🔒</div>
      <h3>${intro}</h3>
      <ul class="paywall-list">
        <li>Los 7 módulos con sus sesiones principales</li>
        <li>Todas las prácticas diarias de 5 minutos</li>
        <li>La sesión final de cierre y mantenimiento</li>
        <li>Acceso para siempre, en cualquier dispositivo</li>
      </ul>
      <button class="btn" onclick="goToPayment()">Desbloquear por ${APP_DATA.price}</button>
      <p class="paywall-note">Pago único y seguro con tarjeta. Sin suscripciones.</p>
      ${session ? "" : `<button class="chip" onclick="renderAccount('login')">Ya lo compré: entrar</button>`}
    </div>
  `;
}

// ─── PANTALLA DE CUENTA ─────────────────────────────────
window.renderAccount = function(mode = "signup", thenPay = false) {
  currentView = () => renderAccount(mode, thenPay);
  highlightTab("progress");
  window.scrollTo(0, 0);
  const isSignup = mode === "signup";

  screen.innerHTML = `
    <div class="card">
      <button class="back-btn" onclick="setActiveTab('progress')">← Volver</button>
      <h2>${isSignup ? "Crea tu cuenta" : "Entra en tu cuenta"}</h2>
      <p class="audio-hint">${isSignup
        ? "Con tu cuenta, tu compra queda guardada y puedes escuchar el programa en cualquier móvil."
        : "Usa el email y la contraseña con los que te registraste."}</p>
      <form id="accountForm" class="account-form" novalidate>
        <label>Email
          <input type="email" id="accEmail" autocomplete="email" required value="${esc(state.leadEmail || "")}">
        </label>
        <label>Contraseña
          <input type="password" id="accPass" autocomplete="${isSignup ? "new-password" : "current-password"}" minlength="6" required>
        </label>
        ${isSignup ? `<p class="audio-hint">Mínimo 6 caracteres.</p>` : ""}
        <p class="form-error" id="accError"></p>
        <button class="btn" type="submit" id="accSubmit">${isSignup ? (thenPay ? "Crear cuenta y continuar al pago" : "Crear cuenta") : "Entrar"}</button>
      </form>
      <button class="chip" style="margin-top:14px" onclick="renderAccount('${isSignup ? "login" : "signup"}', ${thenPay})">
        ${isSignup ? "Ya tengo cuenta: entrar" : "No tengo cuenta: crearla"}
      </button>
      ${isSignup ? "" : `<button class="chip" style="margin-top:10px" onclick="renderForgotPassword()">¿Olvidaste tu contraseña?</button>`}
    </div>
  `;

  $("#accountForm").onsubmit = async (e) => {
    e.preventDefault();
    const email = $("#accEmail").value.trim();
    const password = $("#accPass").value;
    const errorEl = $("#accError");
    errorEl.textContent = "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { errorEl.textContent = "Escribe un email válido."; return; }
    if (password.length < 6) { errorEl.textContent = "La contraseña necesita al menos 6 caracteres."; return; }
    if (!sb) { errorEl.textContent = "No hay conexión. Inténtalo de nuevo en un momento."; return; }

    const button = $("#accSubmit");
    button.disabled = true;
    button.textContent = "Un momento…";

    const { data, error } = isSignup
      ? await sb.auth.signUp({ email, password })
      : await sb.auth.signInWithPassword({ email, password });

    if (error) {
      button.disabled = false;
      button.textContent = isSignup ? "Crear cuenta" : "Entrar";
      errorEl.textContent = authErrorText(error);
      return;
    }

    if (isSignup && !data.session) {
      screen.innerHTML = `
        <div class="card" style="text-align:center">
          <div style="font-size:48px; margin:10px 0">📩</div>
          <h3>Revisa tu email</h3>
          <p>Te hemos enviado un enlace para confirmar tu cuenta. Después vuelve aquí y entra con tu email y contraseña.</p>
          <button class="btn ghost" onclick="renderAccount('login', ${thenPay})">Ya lo he confirmado: entrar</button>
        </div>
      `;
      return;
    }

    await refreshAccess();
    if (thenPay && !hasAccess) return goToPayment();
    setActiveTab("progress");
  };
};

// ─── RECUPERAR CONTRASEÑA ───────────────────────────────
window.renderForgotPassword = function() {
  currentView = () => renderForgotPassword();
  highlightTab("progress");
  window.scrollTo(0, 0);

  screen.innerHTML = `
    <div class="card">
      <button class="back-btn" onclick="renderAccount('login')">← Volver</button>
      <h2>¿Olvidaste tu contraseña?</h2>
      <p class="audio-hint">Escribe el email de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.</p>
      <form id="forgotForm" class="account-form" novalidate>
        <label>Email
          <input type="email" id="forgotEmail" autocomplete="email" required value="${esc(state.leadEmail || "")}">
        </label>
        <p class="form-error" id="forgotError"></p>
        <button class="btn" type="submit" id="forgotSubmit">Enviarme el enlace</button>
      </form>
    </div>
  `;

  $("#forgotForm").onsubmit = async (e) => {
    e.preventDefault();
    const email = $("#forgotEmail").value.trim();
    const errorEl = $("#forgotError");
    errorEl.textContent = "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { errorEl.textContent = "Escribe un email válido."; return; }
    if (!sb) { errorEl.textContent = "No hay conexión. Inténtalo de nuevo en un momento."; return; }

    const button = $("#forgotSubmit");
    button.disabled = true;
    button.textContent = "Un momento…";

    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: location.origin + location.pathname,
    });

    if (error) {
      button.disabled = false;
      button.textContent = "Enviarme el enlace";
      errorEl.textContent = authErrorText(error);
      return;
    }

    // Mismo mensaje exista o no la cuenta, para no revelar qué emails están registrados
    screen.innerHTML = `
      <div class="card" style="text-align:center">
        <div style="font-size:48px; margin:10px 0">📩</div>
        <h3>Revisa tu email</h3>
        <p>Si ${esc(email)} tiene cuenta, en unos minutos te llegará un enlace para crear una contraseña nueva. Mira también en la carpeta de spam.</p>
        <button class="btn ghost" onclick="renderAccount('login')">Volver a entrar</button>
      </div>
    `;
  };
};

window.renderNewPassword = function() {
  currentView = () => renderNewPassword();
  highlightTab("progress");
  window.scrollTo(0, 0);

  screen.innerHTML = `
    <div class="card">
      <h2>Crea tu contraseña nueva</h2>
      <form id="newPassForm" class="account-form" novalidate>
        <label>Contraseña nueva
          <input type="password" id="newPass" autocomplete="new-password" minlength="6" required>
        </label>
        <p class="audio-hint">Mínimo 6 caracteres.</p>
        <p class="form-error" id="newPassError"></p>
        <button class="btn" type="submit" id="newPassSubmit">Guardar contraseña</button>
      </form>
    </div>
  `;

  $("#newPassForm").onsubmit = async (e) => {
    e.preventDefault();
    const password = $("#newPass").value;
    const errorEl = $("#newPassError");
    errorEl.textContent = "";

    if (password.length < 6) { errorEl.textContent = "La contraseña necesita al menos 6 caracteres."; return; }
    if (!session) { errorEl.textContent = "El enlace ha caducado. Pide uno nuevo desde «¿Olvidaste tu contraseña?»."; return; }

    const button = $("#newPassSubmit");
    button.disabled = true;
    button.textContent = "Un momento…";

    const { error } = await sb.auth.updateUser({ password });
    if (error) {
      button.disabled = false;
      button.textContent = "Guardar contraseña";
      errorEl.textContent = authErrorText(error);
      return;
    }

    screen.innerHTML = `
      <div class="card" style="text-align:center">
        <div style="font-size:48px; margin:10px 0">✅</div>
        <h3>Contraseña guardada</h3>
        <p>Ya has entrado en tu cuenta. La próxima vez usa tu contraseña nueva.</p>
        <button class="btn" onclick="setActiveTab('progress')">Continuar</button>
      </div>
    `;
  };
};

function renderRecoveryLinkExpired() {
  screen.innerHTML = `
    <div class="card" style="text-align:center">
      <div style="font-size:48px; margin:10px 0">⌛</div>
      <h3>Este enlace ya no sirve</h3>
      <p>Los enlaces para cambiar la contraseña caducan al cabo de un rato y solo se pueden usar una vez. Pide uno nuevo.</p>
      <button class="btn" onclick="renderForgotPassword()">Pedir un enlace nuevo</button>
    </div>
  `;
}

function authErrorText(error) {
  const msg = (error.message || "").toLowerCase();
  if (msg.includes("already registered")) return "Ese email ya tiene cuenta. Pulsa «Ya tengo cuenta: entrar».";
  if (msg.includes("invalid login")) return "Email o contraseña incorrectos.";
  if (msg.includes("email not confirmed")) return "Confirma tu email con el enlace que te enviamos y vuelve a intentarlo.";
  if (msg.includes("rate limit")) return "Demasiados intentos seguidos. Espera unos minutos.";
  if (msg.includes("different from the old")) return "La contraseña nueva tiene que ser distinta de la anterior.";
  return "No se pudo completar. Inténtalo de nuevo.";
}

// ─── VUELTA DESDE EL PAGO ───────────────────────────────
// Stripe vuelve a la app con ?pago=ok. El desbloqueo llega unos segundos después (aviso de Stripe al servidor).
async function handlePaymentReturn() {
  const params = new URLSearchParams(location.search);
  if (params.get("pago") !== "ok") return false;
  history.replaceState(null, "", location.pathname);

  screen.innerHTML = `
    <div class="card" style="text-align:center">
      <div style="font-size:48px; margin:10px 0">⏳</div>
      <h3>Confirmando tu pago…</h3>
      <p>Esto tarda solo unos segundos.</p>
    </div>
  `;

  for (let i = 0; i < 15 && !hasAccess; i++) {
    await new Promise(r => setTimeout(r, 2000));
    await refreshAccess();
  }

  screen.innerHTML = hasAccess ? `
    <div class="card" style="text-align:center">
      <div style="font-size:56px; margin:10px 0">🌸</div>
      <h2>¡Bienvenida al programa completo!</h2>
      <p>Ya tienes acceso a los 7 módulos y a la sesión de cierre, en cualquier dispositivo donde entres con tu cuenta.</p>
      <button class="btn" onclick="setActiveTab('modules')">Ir a mis módulos</button>
    </div>
  ` : `
    <div class="card" style="text-align:center">
      <div style="font-size:48px; margin:10px 0">🕐</div>
      <h3>Tu pago se está procesando</h3>
      <p>Si en unos minutos no ves los módulos desbloqueados, cierra la app y vuelve a abrirla.${APP_DATA.supportEmail ? ` Si sigue igual, escríbenos a ${esc(APP_DATA.supportEmail)}.` : ""}</p>
      <button class="btn ghost" onclick="setActiveTab('modules')">Ir a mis módulos</button>
    </div>
  `;
  return true;
}

// ─── TEST DE HAMBRE EMOCIONAL ───────────────────────────
let quizAnswers = [];

window.startQuiz = function() {
  quizAnswers = [];
  renderQuizStep();
};

function renderQuizStep() {
  const step = quizAnswers.length;
  const questions = APP_DATA.quiz.questions;
  if (step >= questions.length) return renderQuizResult(quizResultType());

  currentView = renderQuizStep;
  window.scrollTo(0, 0);
  const q = questions[step];
  screen.innerHTML = `
    <div class="card quiz-card">
      <button class="back-btn" onclick="${step === 0 ? "setActiveTab('home')" : "quizBack()"}">← ${step === 0 ? "Salir" : "Atrás"}</button>
      <div class="quiz-step">Pregunta ${step + 1} de ${questions.length}</div>
      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${Math.round(step / questions.length * 100)}%"></div></div>
      <h2 class="quiz-question">${q.text}</h2>
      ${q.options.map((o, i) => `<button class="quiz-option" onclick="quizAnswer(${i})">${o.text}</button>`).join("")}
    </div>
  `;
}

window.quizAnswer = function(i) {
  quizAnswers.push(i);
  renderQuizStep();
};

window.quizBack = function() {
  quizAnswers.pop();
  renderQuizStep();
};

function quizResultType() {
  const questions = APP_DATA.quiz.questions;
  const score = {};
  quizAnswers.forEach((a, i) => {
    const type = questions[i].options[a].type;
    score[type] = (score[type] || 0) + 1;
  });
  const firstType = questions[0].options[quizAnswers[0]].type;
  return Object.keys(score).reduce((best, t) => score[t] > score[best] ? t : best, firstType);
}

function renderQuizResult(type) {
  currentView = () => renderQuizResult(type);
  window.scrollTo(0, 0);
  const r = APP_DATA.quiz.results[type];

  screen.innerHTML = `
    <div class="card quiz-card">
      <div class="quiz-step">Tu tipo de hambre emocional</div>
      <div class="quiz-result-icon">${r.icon}</div>
      <h2>${r.name}</h2>
      <p>${r.short}</p>
      <div class="quiz-locked">🔒 Por qué te pasa y tu plan de 7 días</div>
    </div>

    <div class="card">
      <h3>Recibe tu plan completo, gratis</h3>
      <ul class="paywall-list">
        <li>Tu resultado explicado a fondo</li>
        <li>7 días de pequeños retos para practicar</li>
        <li>El Módulo 1 desbloqueado en la app</li>
      </ul>
      <form id="leadForm" class="account-form" novalidate>
        <label>Tu email
          <input type="email" id="leadEmail" autocomplete="email" placeholder="tu@email.com" required>
        </label>
        <label class="consent">
          <input type="checkbox" id="leadConsent">
          <span>Quiero recibir el plan de 7 días y otros emails de CalmaComida (máximo uno al día). Puedo darme de baja cuando quiera. <a href="privacidad.html" target="_blank">Privacidad</a></span>
        </label>
        <p class="form-error" id="leadError"></p>
        <button class="btn" type="submit" id="leadSubmit">Ver mi resultado y desbloquear el Módulo 1</button>
      </form>
    </div>
  `;

  $("#leadForm").onsubmit = async (e) => {
    e.preventDefault();
    const email = $("#leadEmail").value.trim();
    const consent = $("#leadConsent").checked;
    const errorEl = $("#leadError");
    errorEl.textContent = "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { errorEl.textContent = "Escribe un email válido."; return; }

    const button = $("#leadSubmit");
    button.disabled = true;
    button.textContent = "Un momento…";

    try {
      const res = await fetch(`${APP_DATA.supabaseUrl}/functions/v1/subscribe-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": APP_DATA.supabaseKey },
        body: JSON.stringify({ email, quizType: type, answers: quizAnswers, consent })
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      console.error("No se pudo guardar el email:", err);
      button.disabled = false;
      button.textContent = "Ver mi resultado y desbloquear el Módulo 1";
      errorEl.textContent = "No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.";
      return;
    }

    state.leadEmail = email;
    state.quizType = type;
    save();
    renderQuizFull(type, consent);
  };
}

function renderQuizFull(type, consent) {
  currentView = () => renderQuizFull(type, consent);
  window.scrollTo(0, 0);
  const r = APP_DATA.quiz.results[type];
  screen.innerHTML = `
    <div class="card quiz-card">
      <div class="quiz-step">Tu tipo de hambre emocional</div>
      <div class="quiz-result-icon">${r.icon}</div>
      <h2>${r.name}</h2>
      <p>${r.short}</p>
      <p>${r.full}</p>
      ${consent ? `<p class="reminder-status">📩 Recibirás tu plan de 7 días en ${esc(state.leadEmail)}.</p>` : ""}
    </div>
    <div class="card next-card">
      <div class="next-label">✨ Desbloqueado</div>
      <div class="next-title">Módulo 1 · ${APP_DATA.modules[0].title}</div>
      <div class="next-desc">${APP_DATA.modules[0].desc}</div>
      <button class="btn" onclick="state.programStarted = true; save(); openModule('${APP_DATA.modules[0].id}')">Empezar el Módulo 1</button>
    </div>
  `;
}

// ─── PRÁCTICA DIARIA + RECORDATORIO ─────────────────────
function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function practicedToday() { return !!state.practiceDays[todayKey()]; }

// El módulo de "esta semana": el primero sin completar (o el último si ya están todos),
// limitado a los módulos que la usuaria tiene desbloqueados
function currentModule() {
  const unlocked = APP_DATA.modules.filter(isUnlocked);
  return unlocked.find(m => !state.done[m.id]) || unlocked[unlocked.length - 1] || null;
}

function isReminderDue() {
  if (!state.reminderTime) return false;
  const [h, min] = state.reminderTime.split(":").map(Number);
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() >= h * 60 + min;
}

// Cuenta la práctica del día cuando el audio diario se escucha hasta el final
function trackDailyAudio(audio) {
  if (!audio) return;
  audio.addEventListener("ended", () => {
    state.practiceDays[todayKey()] = true;
    save();
    if (state.lastTab === "home" && document.getElementById("dailyCard")) renderHome();
  });
}

window.saveReminder = function() {
  const value = $("#reminderTime").value;
  if (!value) return;
  state.reminderTime = value;
  save();
  renderProgress();
};

window.clearReminder = function() {
  state.reminderTime = null;
  save();
  renderProgress();
};

// Crea un evento diario con aviso para el calendario del móvil (funciona con la app cerrada)
window.downloadReminderIcs = function() {
  if (!state.reminderTime) return;
  const [h, min] = state.reminderTime.split(":");
  const start = `${todayKey().replace(/-/g, "")}T${h}${min}00`;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CalmaComida//ES",
    "BEGIN:VEVENT",
    `UID:calmacomida-practica-${stamp}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    "DURATION:PT5M",
    "RRULE:FREQ=DAILY",
    "SUMMARY:🌿 CalmaComida · Tu práctica de 5 minutos",
    "DESCRIPTION:Abre CalmaComida y escucha tu práctica diaria.",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Es tu momento: 5 minutos para ti",
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "calmacomida-recordatorio.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

function highlightTab(tab) {
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
}

function setActiveTab(tab) {
  highlightTab(tab);
  state.lastTab = tab;
  save();
  currentView = () => render(tab);
  render(tab);
  window.scrollTo(0, 0);
}

function render(tab) {
  if (tab === "home") renderHome();
  if (tab === "modules") renderModules();
  if (tab === "audio") renderAudios();
  if (tab === "progress") renderProgress();
}

// ─── HOME ───────────────────────────────────────────────
function renderHome() {
  const done = Object.values(state.done).filter(Boolean).length;
  const total = APP_DATA.modules.length;
  const pct = Math.round((done / total) * 100);

  const nextModule = APP_DATA.modules.find(m => !state.done[m.id]);
  const dailyModule = currentModule();
  const showDaily = dailyModule && (state.programStarted || state.reminderTime);
  const showQuiz = !state.leadEmail && !session;

  const howItWorks = APP_DATA.howItWorks.map(h => `
    <div class="how-item">
      <div class="how-icon">${h.icon}</div>
      <div>
        <div class="how-title">${h.title}</div>
        <div class="how-desc">${h.desc}</div>
      </div>
    </div>
  `).join("");

  const testimonials = APP_DATA.testimonials.map(t => `
    <div class="testimonial">
      <p class="testimonial-text">"${t.text}"</p>
      <p class="testimonial-name">— ${t.name}</p>
    </div>
  `).join("");

  screen.innerHTML = `
    <div class="hero">
      <img class="heroImg" src="${APP_DATA.coverImage}" alt="CalmaComida">
      <div class="heroContent">
        <h2>Recupera la paz con la comida</h2>
        <p>Sin dietas. Sin culpa. A tu ritmo.</p>
      </div>
    </div>

    ${showQuiz ? `
    <div class="card quiz-invite" onclick="startQuiz()">
      <div class="next-label">Test gratuito · 1 minuto</div>
      <div class="next-title">¿Qué tipo de hambre emocional tienes?</div>
      <div class="next-desc">Descúbrelo con 5 preguntas y desbloquea gratis el Módulo 1.</div>
      <button class="btn">Hacer el test</button>
    </div>
    ` : ""}

    ${showDaily ? (practicedToday() ? `
    <div class="card daily-done">
      ✅ Práctica de hoy hecha. Gracias por regalarte estos minutos.
    </div>
    ` : `
    <div class="card next-card" id="dailyCard">
      <div class="next-label">${isReminderDue() ? "⏰ Es tu momento" : "🌿 Tu práctica de hoy"}</div>
      <div class="next-title">5 minutos para ti</div>
      <div class="next-desc">${dailyModule.dailyDesc}</div>
      <audio id="dailyPlayer" controls data-audio="${dailyModule.daily}" style="width:100%"></audio>
      ${state.reminderTime ? "" : `
        <button class="btn ghost" onclick="setActiveTab('progress')">⏰ Ponerme un recordatorio diario</button>
      `}
    </div>
    `) : ""}

    ${state.programStarted && nextModule ? `
    <div class="card next-card">
      <div class="next-label">▶ Continúa donde lo dejaste</div>
      <div class="next-title">Módulo ${nextModule.number} · ${nextModule.title}</div>
      <div class="next-desc">${nextModule.desc}</div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="progress-text">${done} de ${total} módulos completados</div>
      <button class="btn" onclick="openModule('${nextModule.id}')">Continuar programa</button>
    </div>
    ` : `
    <div class="card">
      <h3>Programa de 7 semanas</h3>
      <p>Un camino guiado en audio para transformar tu relación con la comida desde la raíz. Sin dietas, sin restricciones.</p>
      <button class="btn" onclick="startProgram()">Empezar el programa</button>
      <button class="btn ghost" onclick="setActiveTab('audio')">Necesito calma ahora</button>
    </div>
    `}

    <div class="card">
      <h3>¿Cómo funciona?</h3>
      ${howItWorks}
    </div>

    <div class="card">
      <h3>Lo que dicen ellas</h3>
      ${testimonials}
    </div>
  `;

  hydrateAudios();
  trackDailyAudio($("#dailyPlayer"));
}

function startProgram() {
  state.programStarted = true;
  save();
  setActiveTab("modules");
}

// ─── MÓDULOS ────────────────────────────────────────────
function renderModules() {
  currentView = renderModules;
  highlightTab("modules");
  const done = Object.values(state.done).filter(Boolean).length;
  const total = APP_DATA.modules.length;
  const pct = Math.round((done / total) * 100);

  const list = APP_DATA.modules.map(m => `
    <div class="module-item ${state.done[m.id] ? 'module-done' : ''}" onclick="openModule('${m.id}')">
      <img src="${m.thumb}" class="audioThumb" alt="${m.title}">
      <div class="module-info">
        <div class="module-num">Módulo ${m.number}</div>
        <div class="module-title">${m.title}</div>
        <div class="module-desc">${m.desc}</div>
      </div>
      <div class="module-check">${!isUnlocked(m) ? (m.free ? '🎁' : '🔒') : state.done[m.id] ? '✅' : '⚪'}</div>
    </div>
  `).join("");

  const closing = APP_DATA.closing;
  const closingIcon = hasAccess && done === total ? "▶" : "🔒";

  screen.innerHTML = `
    <div class="card">
      <h2>Tu Programa</h2>
      <p>7 semanas para sanar tu relación con la comida.</p>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="progress-text">${done} de ${total} módulos completados · ${pct}%</div>
      ${hasAccess ? "" : `<button class="btn" onclick="goToPayment()">Desbloquear el programa completo · ${APP_DATA.price}</button>`}
    </div>

    <div class="card intro-card" onclick="playIntro()">
      <div class="intro-row">
        <div class="intro-icon">🎙️</div>
        <div>
          <div class="intro-title">Bienvenida al programa</div>
          <div class="intro-desc">Escucha esto primero · Cómo sacarle el máximo partido</div>
        </div>
        <div class="play-btn">▶</div>
      </div>
    </div>

    <div class="card">
      ${list}
    </div>

    <div class="card closing-card" onclick="openClosing()">
      <div class="closing-row">
        <img src="${closing.image}" class="audioThumb" alt="Cierre">
        <div>
          <div class="closing-label">Sesión final</div>
          <div class="closing-title">${closing.title}</div>
          <div class="closing-desc">${closing.desc.substring(0, 80)}...</div>
        </div>
        <div>${closingIcon}</div>
      </div>
    </div>
  `;
}

window.openModule = function(id) {
  const m = APP_DATA.modules.find(x => x.id === id);
  state.openModule = id;
  save();
  currentView = () => openModule(id);
  highlightTab("modules");
  window.scrollTo(0, 0);
  const unlocked = isUnlocked(m);

  const lockedContent = m.free ? `
      <div class="card paywall-card">
        <div class="paywall-lock">🎁</div>
        <h3>Este módulo es gratis</h3>
        <p>Haz el test de 1 minuto «¿Qué tipo de hambre emocional tienes?» y desbloquéalo al momento.</p>
        <button class="btn" onclick="startQuiz()">Hacer el test y desbloquear</button>
        ${session ? "" : `<button class="chip" onclick="renderAccount('login')">Ya tengo cuenta: entrar</button>`}
      </div>
  ` : paywallCard("Este módulo forma parte del programa completo");

  screen.innerHTML = `
    <div class="module-detail">
      <button class="back-btn" onclick="renderModules()">← Volver</button>

      <img src="${m.image}" class="module-hero-img" alt="${m.title}">

      <div class="card">
        <div class="module-badge">Módulo ${m.number} de ${APP_DATA.modules.length}</div>
        <h2>${m.title}</h2>
        <p class="module-phrase">"${m.phrase}"</p>
      </div>

      <div class="card">
        <div class="goal-block">
          <div class="goal-label">🎯 Qué vas a trabajar</div>
          <p>${m.goal}</p>
        </div>
        <div class="expect-block">
          <div class="expect-label">✨ Qué vas a conseguir</div>
          <p>${m.expect}</p>
        </div>
      </div>

      ${unlocked ? `
      <div class="card">
        <div class="audio-section-title">🎧 Sesión principal</div>
        <p class="audio-hint">Escúchala una vez esta semana, en un momento tranquilo.</p>
        <audio controls data-audio="${m.audio}" style="width:100%; margin-top:8px"></audio>
      </div>

      <div class="card">
        <div class="audio-section-title">🌿 Práctica diaria (5 min)</div>
        <p class="audio-hint">${m.dailyDesc}</p>
        <audio id="moduleDaily" controls data-audio="${m.daily}" style="width:100%; margin-top:8px"></audio>
      </div>

      <div class="card">
        <button class="btn ${state.done[m.id] ? 'btn-done' : ''}" onclick="toggleDone('${m.id}')">
          ${state.done[m.id] ? '✅ Módulo completado' : 'Marcar como completado'}
        </button>
      </div>
      ` : lockedContent}
    </div>
  `;

  hydrateAudios();
  trackDailyAudio($("#moduleDaily"));
};

window.toggleDone = function(id) {
  state.done[id] = !state.done[id];
  save();
  openModule(id);
};

window.playIntro = function() {
  currentView = playIntro;
  screen.innerHTML = `
    <div class="card">
      <button class="back-btn" onclick="renderModules()">← Volver</button>
      <h2>🎙️ Bienvenida al programa</h2>
      <p>Antes de empezar, escucha esta introducción para entender cómo funciona el programa y sacarle el máximo partido.</p>
      <audio controls src="audio/intro-curso.mp3" style="width:100%; margin-top:15px" autoplay></audio>
      <button class="btn" style="margin-top:20px" onclick="renderModules()">Entendido, empezar →</button>
    </div>
  `;
};

window.openClosing = function() {
  const c = APP_DATA.closing;
  const allDone = Object.values(state.done).filter(Boolean).length === APP_DATA.modules.length;
  currentView = openClosing;
  window.scrollTo(0, 0);

  if (!hasAccess) {
    screen.innerHTML = `
      <div class="module-detail">
        <button class="back-btn" onclick="renderModules()">← Volver</button>
        ${paywallCard("La sesión de cierre forma parte del programa completo")}
      </div>
    `;
    return;
  }

  if (!allDone) {
    screen.innerHTML = `
      <div class="card" style="text-align:center">
        <button class="back-btn" onclick="renderModules()">← Volver</button>
        <div style="font-size:48px; margin:20px 0">🔒</div>
        <h3>Sesión de cierre</h3>
        <p>Completa los 7 módulos para desbloquear tu sesión de cierre y mantenimiento.</p>
        <p style="color:var(--muted); font-size:14px">Te queda lo mejor. ¡Sigue adelante!</p>
        <button class="btn ghost" onclick="renderModules()">Continuar el programa</button>
      </div>
    `;
    return;
  }

  screen.innerHTML = `
    <div class="card">
      <button class="back-btn" onclick="renderModules()">← Volver</button>
      <img src="${c.image}" style="width:100%; border-radius:15px; margin:15px 0" alt="Cierre">
      <h2>${c.title}</h2>
      <p>${c.desc}</p>
      <div class="goal-block" style="margin:15px 0">
        <div class="goal-label">🎯 Objetivo</div>
        <p>${c.goal}</p>
      </div>
      <div class="expect-block" style="margin:15px 0">
        <div class="expect-label">✨ Qué conseguirás</div>
        <p>${c.expect}</p>
      </div>
      <audio controls data-audio="${c.audio}" style="width:100%; margin-top:10px"></audio>
    </div>
  `;
  hydrateAudios();
};

// ─── CALMA / AUDIOS ─────────────────────────────────────
function renderAudios() {
  const quick = APP_DATA.audioStates.map(a => `
    <div class="item" onclick="playQuickAudio('${a.file}', '${a.title}')">
      <img src="${a.thumb}" class="audioThumb" alt="${a.title}">
      <div>
        <div style="font-weight:800">${a.title}</div>
        <div style="font-size:13px; color:var(--muted)">${a.desc}</div>
      </div>
      <div style="font-size:22px">▶</div>
    </div>
  `).join("");

  screen.innerHTML = `
    <div class="card">
      <h2>Ayuda Rápida</h2>
      <p>Audios cortos para momentos difíciles. Úsalos cuando más los necesites.</p>
      ${quick}
    </div>

    <div class="card" id="playerCard" style="display:none">
      <div id="nowPlaying" style="font-weight:700; margin-bottom:10px; color:var(--brand)"></div>
      <audio id="mainPlayer" controls style="width:100%"></audio>
    </div>

    <div class="card">
      <h3>¿Cómo funciona la app?</h3>
      <div class="how-item">
        <div class="how-icon">1️⃣</div>
        <div>
          <div class="how-title">Empieza por la Bienvenida</div>
          <div class="how-desc">En "Aprender", escucha primero el audio de introducción para entender el método.</div>
        </div>
      </div>
      <div class="how-item">
        <div class="how-icon">2️⃣</div>
        <div>
          <div class="how-title">Un módulo por semana</div>
          <div class="how-desc">Cada semana trabaja un aspecto de tu relación con la comida. Sin prisa.</div>
        </div>
      </div>
      <div class="how-item">
        <div class="how-icon">3️⃣</div>
        <div>
          <div class="how-title">El audio diario, cada día</div>
          <div class="how-desc">5 minutos al día es suficiente. En el coche, antes de comer, antes de dormir.</div>
        </div>
      </div>
      <div class="how-item">
        <div class="how-icon">4️⃣</div>
        <div>
          <div class="how-title">Ayuda Rápida cuando la necesites</div>
          <div class="how-desc">Si tienes un momento difícil, usa los audios de arriba. Son tu salvavidas.</div>
        </div>
      </div>
    </div>
  `;
}

window.playQuickAudio = function(file, title) {
  const card = $("#playerCard");
  const player = $("#mainPlayer");
  const label = $("#nowPlaying");
  card.style.display = "block";
  label.textContent = "▶ " + title;
  player.src = file;
  player.play().catch(() => {});
  card.scrollIntoView({ behavior: "smooth" });
};

// ─── MI VIAJE / PROGRESO ────────────────────────────────
function renderProgress() {
  const done = Object.values(state.done).filter(Boolean).length;
  const total = APP_DATA.modules.length;
  const pct = Math.round((done / total) * 100);

  const emoji = done === 0 ? "🌱" : done < 3 ? "🌿" : done < 6 ? "🌳" : "🌸";
  const msg = done === 0
    ? "Tu camino empieza con el primer paso. ¡Tú puedes!"
    : done < 3
    ? "Estás empezando a construir algo importante. Sigue."
    : done < 6
    ? "Ya estás en el corazón del programa. Se nota el cambio."
    : done < total
    ? "Casi lo tienes. El final es el más poderoso."
    : "Lo has conseguido. Eres una versión más libre de ti misma.";

  const moduleProgress = APP_DATA.modules.map(m => `
    <div class="progress-module-item">
      <img src="${m.thumb}" class="progress-thumb" alt="${m.title}">
      <div class="progress-module-info">
        <div class="progress-module-title">Módulo ${m.number} · ${m.title}</div>
        <div class="progress-module-status ${state.done[m.id] ? 'status-done' : 'status-pending'}">
          ${state.done[m.id] ? '✅ Completado' : '⏳ Pendiente'}
        </div>
      </div>
    </div>
  `).join("");

  screen.innerHTML = `
    <div class="card" style="text-align:center">
      <div style="font-size:64px; margin:10px 0">${emoji}</div>
      <h2>Tu Transformación</h2>
      <p>${msg}</p>
      <div class="progress-bar-wrap" style="margin:15px 0">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="progress-big">${pct}% completado</div>
      <div class="progress-text">${done} de ${total} módulos</div>
    </div>

    <div class="card">
      <h3>👤 Tu cuenta</h3>
      ${session ? `
        <p class="audio-hint">Has entrado como <b>${esc(session.user.email)}</b></p>
        <p class="reminder-status">${hasAccess ? "✅ Programa completo desbloqueado" : "Plan gratuito: Bienvenida, Módulo 1 y Ayuda Rápida"}</p>
        ${hasAccess ? "" : `<button class="btn" onclick="goToPayment()">Desbloquear el programa completo · ${APP_DATA.price}</button>`}
        <button class="chip" style="margin-top:12px" onclick="logout()">Cerrar sesión</button>
      ` : `
        <p class="audio-hint">Crea una cuenta para comprar el programa completo y escucharlo en cualquier móvil.</p>
        <button class="btn" onclick="renderAccount('signup')">Crear cuenta</button>
        <button class="btn ghost" onclick="renderAccount('login')">Ya tengo cuenta: entrar</button>
      `}
    </div>

    <div class="card">
      <h3>⏰ Recordatorio diario</h3>
      <p class="audio-hint">Elige a qué hora quieres hacer tu práctica de 5 minutos.</p>
      <div class="reminder-row">
        <input type="time" id="reminderTime" class="time-input" value="${state.reminderTime || "20:00"}">
        <button class="btn reminder-save" onclick="saveReminder()">${state.reminderTime ? "Cambiar" : "Activar"}</button>
      </div>
      ${state.reminderTime ? `
        <p class="reminder-status">Activo · cada día a las <b>${state.reminderTime}</b></p>
        <button class="btn ghost" onclick="downloadReminderIcs()">📅 Añadir aviso a mi calendario</button>
        <p class="audio-hint" style="margin-top:8px">Así el móvil te avisará cada día aunque la app esté cerrada.</p>
        <button class="chip" style="margin-top:12px" onclick="clearReminder()">Quitar recordatorio</button>
      ` : ""}
    </div>

    <div class="card">
      <h3>Tu recorrido</h3>
      ${moduleProgress}
    </div>

    <div class="card" style="text-align:center">
      <button class="btn ghost" onclick="resetProgress()">
  Reiniciar mi viaje
</button>
    </div>
  `;
}
window.resetProgress = function () {
  const confirmReset = confirm(
    "¿Estás segura de que quieres reiniciar tu proceso?\n\n" +
    "Esto borrará TODO tu progreso:\n" +
    "✔ Módulos completados\n" +
    "✔ Tu avance del programa\n" +
    "✔ Tu estado actual\n\n" +
    "No podrás deshacer esta acción."
  );

  if (!confirmReset) return;

  // Reseteo completo
  state.done = {};
  state.programStarted = false;
  save();

  alert("Tu proceso ha sido reiniciado. Puedes comenzar de nuevo cuando quieras.");
  renderProgress();
};
// ─── INIT ───────────────────────────────────────────────
document.querySelectorAll(".tab").forEach(t => t.onclick = () => setActiveTab(t.dataset.tab));

(async function boot() {
  // Pintamos ya la parte gratuita y, cuando sepamos si hay sesión y compra, repintamos
  setActiveTab(state.lastTab || "home");
  await refreshAccess().catch(err => console.error("Acceso:", err));
  if (isPasswordRecovery && session) renderNewPassword();
  else if (recoveryLinkError) { history.replaceState(null, "", location.pathname); renderRecoveryLinkExpired(); }
  else if (!(await handlePaymentReturn())) currentView();

  if (sb) {
    sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") { setTimeout(() => refreshAccess().then(() => renderNewPassword()), 0); return; }
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT") return;
      // Mientras crea su contraseña nueva no la sacamos de esa pantalla
      if (isPasswordRecovery && event === "SIGNED_IN") return;
      // Fuera del callback: Supabase recomienda no llamar a la API dentro de él
      setTimeout(() => refreshAccess().then(() => currentView()), 0);
    });
  }
})();

// Al volver a la app (p. ej. desde el aviso del calendario), refresca la práctica del día en Inicio
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && state.lastTab === "home") renderHome();
});

// Permite instalar la app y abrirla sin conexión
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}