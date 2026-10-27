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

// ─── PRÁCTICA DIARIA + RECORDATORIO ─────────────────────
function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function practicedToday() { return !!state.practiceDays[todayKey()]; }

// El módulo de "esta semana": el primero sin completar (o el último si ya están todos)
function currentModule() {
  return APP_DATA.modules.find(m => !state.done[m.id]) || APP_DATA.modules[APP_DATA.modules.length - 1];
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
  const showDaily = state.programStarted || state.reminderTime;

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

    ${showDaily ? (practicedToday() ? `
    <div class="card daily-done">
      ✅ Práctica de hoy hecha. Gracias por regalarte estos minutos.
    </div>
    ` : `
    <div class="card next-card" id="dailyCard">
      <div class="next-label">${isReminderDue() ? "⏰ Es tu momento" : "🌿 Tu práctica de hoy"}</div>
      <div class="next-title">5 minutos para ti</div>
      <div class="next-desc">${dailyModule.dailyDesc}</div>
      <audio id="dailyPlayer" controls src="${dailyModule.daily}" style="width:100%"></audio>
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

  trackDailyAudio($("#dailyPlayer"));
}

function startProgram() {
  state.programStarted = true;
  save();
  setActiveTab("modules");
}

// ─── MÓDULOS ────────────────────────────────────────────
function renderModules() {
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
      <div class="module-check">${state.done[m.id] ? '✅' : '⚪'}</div>
    </div>
  `).join("");

  const closing = APP_DATA.closing;
  const closingIcon = done === total ? "▶" : "🔒";

  screen.innerHTML = `
    <div class="card">
      <h2>Tu Programa</h2>
      <p>7 semanas para sanar tu relación con la comida.</p>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="progress-text">${done} de ${total} módulos completados · ${pct}%</div>
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
  highlightTab("modules");
  window.scrollTo(0, 0);

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

      <div class="card">
        <div class="audio-section-title">🎧 Sesión principal</div>
        <p class="audio-hint">Escúchala una vez esta semana, en un momento tranquilo.</p>
        <audio controls src="${m.audio}" style="width:100%; margin-top:8px"></audio>
      </div>

      <div class="card">
        <div class="audio-section-title">🌿 Práctica diaria (5 min)</div>
        <p class="audio-hint">${m.dailyDesc}</p>
        <audio id="moduleDaily" controls src="${m.daily}" style="width:100%; margin-top:8px"></audio>
      </div>

      <div class="card">
        <button class="btn ${state.done[m.id] ? 'btn-done' : ''}" onclick="toggleDone('${m.id}')">
          ${state.done[m.id] ? '✅ Módulo completado' : 'Marcar como completado'}
        </button>
      </div>
    </div>
  `;

  trackDailyAudio($("#moduleDaily"));
};

window.toggleDone = function(id) {
  state.done[id] = !state.done[id];
  save();
  openModule(id);
};

window.playIntro = function() {
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
      <audio controls src="${c.audio}" style="width:100%; margin-top:10px"></audio>
    </div>
  `;
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
setActiveTab(state.lastTab || "home");

// Al volver a la app (p. ej. desde el aviso del calendario), refresca la práctica del día en Inicio
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && state.lastTab === "home") renderHome();
});

// Permite instalar la app y abrirla sin conexión
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}