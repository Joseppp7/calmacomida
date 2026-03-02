/* ============================================================
   CalmaComida — app.js
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");
const STORAGE_KEY = "calmacomida_v3";

// --- Estado ---
let state = { done: {}, lastTab: "home" };
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state = JSON.parse(saved);
} catch(e) {}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function stats() {
  const total = (APP_DATA.modules || []).length;
  const done  = Object.values(state.done).filter(Boolean).length;
  const pct   = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

// --- Navegación ---
function setActiveTab(tab) {
  state.lastTab = tab;
  saveState();
  document.querySelectorAll(".tab").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === tab)
  );
  render(tab);
}

function render(tab) {
  if (!window.APP_DATA) {
    screen.innerHTML = `<div class="card"><p class="p" style="color:red">Error: no se encontró data.js. Asegúrate de que el archivo está en la misma carpeta.</p></div>`;
    return;
  }
  if (tab === "home")     return renderHome();
  if (tab === "modules")  return renderModules();
  if (tab === "audio")    return renderAudios();
  if (tab === "progress") return renderProgress();
}

/* ============================================================
   INICIO
   ============================================================ */
function renderHome() {
  const { done, total, pct } = stats();

  screen.innerHTML = `
    <section class="hero">
      <img class="heroImg"
        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=70"
        alt="Portada" onerror="this.style.display='none'">
      <div class="heroContent">
        <p class="heroTitle">Tu relación con la comida puede volverse más ligera</p>
        <p class="heroText">No es fuerza de voluntad. Es regulación + hábito.</p>
      </div>
    </section>

    <section class="card" style="margin-top:16px">
      <h2 class="h2">¿Cómo usar CalmaComida?</h2>

      <div class="howto-step">
        <div class="howto-icon">🌅</div>
        <div>
          <b>Cada día: el módulo del día</b>
          <p class="p">Abre <b>Módulos</b> y escucha el audio principal en un momento tranquilo.</p>
        </div>
      </div>

      <div class="howto-step">
        <div class="howto-icon">🍽️</div>
        <div>
          <b>Antes de comer: la práctica diaria</b>
          <p class="p">Dentro de cada módulo hay un audio corto. Escúchalo justo antes de sentarte a comer.</p>
        </div>
      </div>

      <div class="howto-step">
        <div class="howto-icon">🆘</div>
        <div>
          <b>En un momento difícil: Ayuda</b>
          <p class="p">Si sientes un impulso, ansiedad o culpa, ve a la pestaña <b>Ayuda</b>.</p>
        </div>
      </div>

      <div class="howto-step">
        <div class="howto-icon">✅</div>
        <div>
          <b>Marca lo que completas</b>
          <p class="p">Al terminar cada módulo pulsa "Marcar como terminado". Tu progreso se guarda.</p>
        </div>
      </div>

      <div class="howto-tip">
        💡 <b>No necesitas hacerlo perfecto. Solo constante.</b><br>
        Un día a la vez es suficiente.
      </div>

      <div class="row" style="margin-top:20px">
        <button class="btn" id="goModules">Empezar módulos</button>
        <button class="btn ghost" id="goAudio">Ayuda rápida</button>
      </div>
    </section>

    <section class="card">
      <h2 class="h2">Tu progreso</h2>
      <div class="progress-container">
        <div class="progress-bar" style="width:${pct}%"></div>
      </div>
      <p class="p" style="margin-top:10px; text-align:center">
        Has completado el <b>${pct}%</b> del camino
      </p>
      <div class="grid2" style="margin-top:14px">
        <div class="kpi"><b>${done}</b><small>Módulos hechos</small></div>
        <div class="kpi"><b>${total - done}</b><small>Por descubrir</small></div>
      </div>
    </section>
  `;

  $("#goModules").onclick = () => setActiveTab("modules");
  $("#goAudio").onclick   = () => setActiveTab("audio");
}

/* ============================================================
   MÓDULOS
   ============================================================ */
function renderModules() {
  const items = APP_DATA.modules.map(m => {
    const isDone = !!state.done[m.id];
    const img = m.image ||
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=60";
    return `
      <div class="item" data-open="${m.id}">
        <img src="${img}" class="audioThumb"
          style="width:70px;height:70px;border-radius:12px;object-fit:cover;"
          onerror="this.src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=150&q=60'">
        <div style="flex:1">
          <div class="itemTitle">${m.title}</div>
          <div class="itemSub">${m.desc || m.goal || ""}</div>
        </div>
        <span style="font-size:22px">${isDone ? "✅" : "⚪"}</span>
      </div>
    `;
  }).join("");

  screen.innerHTML = `
    <section class="card">
      <h2 class="h2">Programa de Transformación</h2>
      <p class="p">Un paso a la vez. Elige el módulo de hoy:</p>
      <div class="list" style="margin-top:15px">${items}</div>
    </section>
  `;

  screen.querySelectorAll("[data-open]").forEach(el => {
    el.onclick = () => openModule(el.dataset.open);
  });
}

/* ============================================================
   DETALLE DE MÓDULO
   ============================================================ */
function openModule(id) {
  const m = APP_DATA.modules.find(x => x.id === id);
  if (!m) return;
  const isDone = !!state.done[id];
  const img = m.image ||
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=70";

  screen.innerHTML = `
    <section class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
        <div>
          <h2 class="h2" style="margin-bottom:4px">${m.title}</h2>
          <p class="p">${m.desc || ""}</p>
        </div>
        <button class="chip" id="btnBack">← Volver</button>
      </div>

      <div class="moduleHero">
        <img class="moduleHeroImg" src="${img}" alt="${m.title}"
          onerror="this.style.display='none'">
        <div class="moduleHeroOverlay">
          <div class="moduleHeroCaption">${m.phrase || m.goal || ""}</div>
        </div>
      </div>

      <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
        <div class="kpi" style="text-align:left">
          <b style="font-size:14px">🎯 Objetivo</b>
          <small style="font-size:13px;text-transform:none;letter-spacing:0">${m.goal || "—"}</small>
        </div>
        <div class="kpi" style="text-align:left">
          <b style="font-size:14px">✨ Qué puedes esperar</b>
          <small style="font-size:13px;text-transform:none;letter-spacing:0">${m.expect || "—"}</small>
        </div>
      </div>

      <div class="audioBox">
        <div style="font-weight:900;margin-bottom:10px">🎧 Audios del módulo</div>
        <audio id="player" controls style="width:100%"></audio>
        <div class="row" style="margin-top:10px">
          <button class="btn ghost" id="btnMain" ${m.audio ? "" : "disabled"}>▶ Sesión principal</button>
          <button class="btn" id="btnDaily" ${m.daily ? "" : "disabled"}>☀ Práctica diaria</button>
        </div>
        <div class="howto-tip" style="margin-top:12px">
          🍽️ <b>Consejo:</b> Usa la <b>Práctica diaria</b> justo antes de comer.
        </div>
      </div>

      <div class="row" style="margin-top:16px">
        <button class="btn" id="btnDone">
          ${isDone ? "Marcar como NO terminado" : "Marcar como terminado ✓"}
        </button>
        <button class="btn ghost" id="btnNext">Siguiente →</button>
      </div>
    </section>
  `;

  $("#btnBack").onclick = () => renderModules();

  const player = document.getElementById("player");
  const btnMain = $("#btnMain");
  const btnDaily = $("#btnDaily");

  if (m.audio && btnMain) {
    btnMain.onclick = () => { player.src = m.audio; player.play().catch(() => {}); };
  }
  if (m.daily && btnDaily) {
    btnDaily.onclick = () => { player.src = m.daily; player.play().catch(() => {}); };
  }

  $("#btnDone").onclick = () => {
    state.done[id] = !state.done[id];
    saveState();
    openModule(id);
  };

  $("#btnNext").onclick = () => {
    const idx  = APP_DATA.modules.findIndex(x => x.id === id);
    const next = APP_DATA.modules[idx + 1];
    if (next) openModule(next.id);
    else alert("¡Has completado todos los módulos! 🎉");
  };
}

/* ============================================================
   AYUDA RÁPIDA
   ============================================================ */
function renderAudios() {
  const estados = (APP_DATA.audioStates || []).map(a => `
    <div class="item" onclick="playDirect('${a.file}')"
      style="cursor:pointer;padding:15px;background:var(--soft);border-radius:20px;display:flex;align-items:center;">
      <img src="${a.image || ''}" class="audioThumb"
        style="width:80px;height:80px;border-radius:15px;margin-right:15px;object-fit:cover;"
        onerror="this.src='https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=150&q=60'">
      <div style="flex:1">
        <div style="font-weight:900;font-size:17px;color:var(--brand)">${a.title}</div>
        <div style="font-size:13px;color:var(--muted);margin-top:4px">${a.desc}</div>
      </div>
      <div style="background:var(--brand);color:white;width:36px;height:36px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;">▶</div>
    </div>
  `).join("");

  // Si no hay audioStates, mostramos los audios normales como fallback
  const fallback = !APP_DATA.audioStates || APP_DATA.audioStates.length === 0
    ? (APP_DATA.audios || []).map(a => `
        <div class="item" style="padding:14px;flex-direction:column;align-items:flex-start">
          <div style="font-weight:700;margin-bottom:8px">${a.title}</div>
          <audio src="${a.file}" controls style="width:100%"></audio>
        </div>
      `).join("")
    : "";

  screen.innerHTML = `
    <section class="card" style="border:2px solid var(--accent)">
      <h2 class="h2">🆘 Ayuda Ahora</h2>
      <p class="p" style="margin-bottom:20px">No luches sola. Elige cómo te sientes:</p>
      <div class="list">
        ${estados || fallback}
      </div>
      <div id="playerContainer" style="display:none;margin-top:20px;padding:15px;
        background:var(--soft);border-radius:15px">
        <p style="font-weight:800;font-size:14px;margin:0 0 10px;text-align:center">
          Reproduciendo audio de calma...
        </p>
        <audio id="quickPlayer" controls style="width:100%"></audio>
      </div>
    </section>
  `;
}

window.playDirect = (file) => {
  const container = document.getElementById("playerContainer");
  const player    = document.getElementById("quickPlayer");
  if (!container || !player) return;
  container.style.display = "block";
  player.src = file;
  player.play().catch(() => {});
  container.scrollIntoView({ behavior: "smooth" });
};

/* ============================================================
 /* ============================================================
   PROGRESO (CON IMAGEN MOTIVADORA)
   ============================================================ */
function renderProgress() {
  const { done, total, pct } = stats();

  // Imagen motivadora (puedes cambiar este link por una foto tuya si quieres)
  const progressImg = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80";

  let icon = "🌱", message = "Cada paso cuenta. Lo importante es empezar.";
  if (pct > 0)   { icon = "🌿"; message = "¡Ya has empezado! El primer paso es el más difícil."; }
  if (pct > 30)  { icon = "✨"; message = "Lo estás haciendo genial. Tu cuerpo agradece esta calma."; }
  if (pct > 60)  { icon = "🧘"; message = "¡Casi lo tienes! Estás transformando tu relación con la comida."; }
  if (pct >= 100){ icon = "👑"; message = "¡Increíble! Has completado el programa. Eres pura inspiración."; }

  screen.innerHTML = `
    <section class="card" style="padding:0; overflow:hidden;">
      <!-- IMAGEN NUEVA ENCIMA -->
      <img src="${progressImg}" style="width:100%; height:180px; object-fit:cover; border-radius:0;">
      
      <div style="text-align:center; padding:30px 20px">
        <div style="font-size:50px; margin-top:-60px; background:white; width:90px; height:90px; line-height:90px; border-radius:50%; margin-left:auto; margin-right:auto; box-shadow:var(--shadow); position:relative; z-index:2;">${icon}</div>
        
        <h2 class="h2" style="margin-top:15px">Tu Transformación</h2>
        <p class="p" style="font-style:italic; color:var(--brand); font-weight:600; margin-top:6px">
          "${message}"
        </p>

        <div class="progress-container">
          <div class="progress-bar" style="width:${pct}%"></div>
        </div>
        <p class="p" style="margin-top:10px">Has completado el <b>${pct}%</b> del camino</p>
        
        <div class="grid2" style="margin-top:20px">
          <div class="kpi"><b>${done}</b><small>Módulos hechos</small></div>
          <div class="kpi"><b>${total - done}</b><small>Por descubrir</small></div>
        </div>
      </div>
    </section>

    <section class="card">
      <h3 class="h2" style="font-size:18px">Recordatorio amable</h3>
      <p class="p">La transformación no es una línea recta. Si un día no puedes, no pasa nada. Mañana la app seguirá aquí esperándote.</p>
      <div class="row" style="margin-top:16px">
        <button class="btn" id="toContinue">Continuar ahora</button>
        <button class="btn ghost" id="toHome">Ir al inicio</button>
      </div>
    </section>

    <div style="text-align:center; padding:16px 0 30px">
      <button class="chip" id="btnReset" style="opacity:0.45; font-size:11px">
        Reiniciar todo el progreso
      </button>
    </div>
  `;

  $("#toContinue").onclick = () => setActiveTab("modules");
  $("#toHome").onclick     = () => setActiveTab("home");
  $("#btnReset").onclick   = () => {
    if (confirm("¿Seguro que quieres borrar todo tu progreso? No se puede deshacer.")) {
      localStorage.removeItem(STORAGE_KEY);
      state = { done: {}, lastTab: "home" };
      setActiveTab("home");
    }
  };
}
/* ============================================================
   SERVICE WORKER
   ============================================================ */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}

/* ============================================================
   ARRANQUE
   ============================================================ */
const titleEl    = document.getElementById("appTitle");
const subtitleEl = document.getElementById("appSubtitle");
if (titleEl && APP_DATA.name)     titleEl.textContent    = APP_DATA.name;
if (subtitleEl && APP_DATA.subtitle) subtitleEl.textContent = APP_DATA.subtitle;

document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => setActiveTab(btn.dataset.tab);
});

setActiveTab(state.lastTab || "home");