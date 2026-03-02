// === BOOTSTRAP ===
(function waitForData(){
  if (window.APP_DATA) { return; }
  if (!window.__DATA_WAIT_START) window.__DATA_WAIT_START = Date.now();
  if (Date.now() - window.__DATA_WAIT_START > 2000) {
    document.body.innerHTML = `<pre style="padding:12px">[CalmaComida ERROR]\nNo se cargó data.js</pre>`;
    return;
  }
  setTimeout(waitForData, 50);
})();

const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");
const STORAGE_KEY = "calmacomida_state_v3";

let state = loadState();

function loadState(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { done:{}, lastTab:"home", streak:0, lastCompleted:null };
  }catch{ return { done:{}, lastTab:"home", streak:0, lastCompleted:null }; }
}

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function stats(){
  const total = APP_DATA.modules.length;
  const done = Object.values(state.done).filter(Boolean).length;
  const pct = total ? Math.round((done/total)*100) : 0;
  return { total, done, pct };
}

function setActiveTab(tab){
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  state.lastTab = tab;
  saveState();
  render(tab);
}

function render(tab){
  if(tab === "home") return renderHome();
  if(tab === "modules") return renderModules();
  if(tab === "audio") return renderAudios();
  if(tab === "progress") return renderProgress();
}

/* ===== HOME ===== */
function renderHome(){
  const {done, total, pct} = stats();

  screen.innerHTML = `
    <section class="hero">
      <img class="heroImg" src="${APP_DATA.coverImage || ""}" alt="Portada" onerror="this.style.display='none'">
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
          <p class="p">Abre <b>Módulos</b> y escucha el audio principal en un momento tranquilo. Por la mañana, a mediodía o cuando tengas 10 minutos para ti.</p>
        </div>
      </div>

      <div class="howto-step">
        <div class="howto-icon">🍽️</div>
        <div>
          <b>Antes de comer: la práctica diaria</b>
          <p class="p">Dentro de cada módulo hay un audio corto. Escúchalo justo antes de sentarte a comer. Cambia cómo te sientes en la mesa.</p>
        </div>
      </div>

      <div class="howto-step">
        <div class="howto-icon">🆘</div>
        <div>
          <b>En un momento difícil: Ayuda Rápida</b>
          <p class="p">Si sientes un impulso, ansiedad o culpa, ve a la pestaña <b>Ayuda Rápida</b>. Hay audios cortos para ese momento exacto.</p>
        </div>
      </div>

      <div class="howto-step">
        <div class="howto-icon">✅</div>
        <div>
          <b>Marca lo que completas</b>
          <p class="p">Al terminar cada módulo pulsa "Marcar como terminado". Tu progreso se guarda en este dispositivo.</p>
        </div>
      </div>

      <div class="howto-tip">
        💡 <b>No necesitas hacerlo perfecto. Solo constante.</b><br>
        Un día a la vez es suficiente.
      </div>

      <div class="row" style="margin-top:16px">
        <button class="btn" id="goModules">Empezar módulos</button>
        <button class="btn ghost" id="goAudio">Ayuda rápida</button>
      </div>
    </section>

    <section class="card">
      <h2 class="h2">Tu progreso</h2>
      <div class="grid2">
        <div class="kpi">
          <b>${pct}%</b>
          <small>Completado</small>
        </div>
        <div class="kpi">
          <b>${done}/${total}</b>
          <small>Módulos marcados</small>
        </div>
      </div>
    </section>
  `;

  $("#goModules").onclick = () => setActiveTab("modules");
  $("#goAudio").onclick = () => setActiveTab("audio");
}

/* ===== MODULES LIST ===== */
function renderModules(){
  const items = APP_DATA.modules.map(m => {
    const isDone = !!state.done[m.id];
    const imgUrl = m.image || `https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=60`;
    return `
      <div class="item" data-open="${m.id}" style="align-items:center; padding:12px;">
        <img src="${imgUrl}" class="audioThumb" style="width:70px; height:70px; object-fit:cover; border-radius:12px; margin-right:15px; flex-shrink:0;">
        <div style="flex:1">
          <div class="itemTitle" style="font-weight:800; font-size:16px;">${m.title}</div>
          <div class="itemSub" style="font-size:12px; color:var(--muted); line-height:1.3;">${m.desc}</div>
        </div>
        <div style="margin-left:10px;">
          ${isDone ? '<span style="font-size:20px;">✅</span>' : '<span style="font-size:20px; opacity:0.2;">⚪</span>'}
        </div>
      </div>
    `;
  }).join("");

  screen.innerHTML = `
    <section class="card">
      <h2 class="h2">Programa de Transformación</h2>
      <p class="p">Un paso a la vez. Elige el módulo de hoy:</p>
      <div class="list" style="margin-top:15px;">${items}</div>
    </section>
  `;

  screen.querySelectorAll("[data-open]").forEach(el => {
    el.onclick = () => openModule(el.dataset.open);
  });
}

/* ===== MODULE DETAIL ===== */
function openModule(id){
  const m = APP_DATA.modules.find(x => x.id === id);
  if(!m){ alert("No se encontró el módulo."); return; }
  const isDone = !!state.done[id];

  screen.innerHTML = `
    <section class="card">
      <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start">
        <div>
          <h2 class="h2" style="margin-bottom:4px">${m.title}</h2>
          <p class="p">${m.desc || ""}</p>
        </div>
        <button class="chip" id="btnBack">Volver</button>
      </div>

      <div class="moduleHero">
        <img class="moduleHeroImg" src="${m.image || ""}" alt="Imagen del módulo" onerror="this.style.display='none'">
        <div class="moduleHeroOverlay">
          <div class="moduleHeroCaption">${m.phrase || ""}</div>
        </div>
      </div>

      <div style="margin-top:14px">
        <div class="kpi" style="background:var(--soft)">
          <b>🎯 Objetivo del módulo</b>
          <small>${m.goal || "—"}</small>
        </div>
      </div>

      <div style="margin-top:10px">
        <div class="kpi" style="background:var(--soft)">
          <b>✨ Qué puedes esperar</b>
          <small>${m.expect || "—"}</small>
        </div>
      </div>

      <div class="audioBox">
        <div style="font-weight:900; margin-bottom:8px">🎧 Audios del módulo</div>
        ${(m.audio || m.daily) ? `
          <audio id="player" controls src="${m.audio || ""}"></audio>
          <div class="row" style="margin-top:10px">
            <button class="btn ghost" id="btnMainAudio" ${m.audio ? "" : "disabled"}>▶ Sesión principal</button>
            <button class="btn" id="btnDailyAudio" ${m.daily ? "" : "disabled"}>☀ Práctica diaria</button>
          </div>
          <div class="howto-tip" style="margin-top:12px">
            🍽️ <b>Consejo:</b> Usa la <b>Práctica diaria</b> justo antes de comer o cuando notes ansiedad.
          </div>
        ` : `<p class="p">Este módulo aún no tiene audio asignado.</p>`}
      </div>

      <div class="row">
        <button class="btn" id="btnDone">${isDone ? "Marcar como NO terminado" : "Marcar como terminado ✓"}</button>
        <button class="btn ghost" id="btnNext">Siguiente módulo →</button>
      </div>
    </section>
  `;

  $("#btnBack").onclick = () => renderModules();

  const player = document.getElementById("player");
  const btnMain = document.getElementById("btnMainAudio");
  if(btnMain && m.audio && player){
    btnMain.onclick = () => { player.src = m.audio; player.play().catch(()=>{}); };
  }
  const btnDaily = document.getElementById("btnDailyAudio");
  if(btnDaily && m.daily && player){
    btnDaily.onclick = () => { player.src = m.daily; player.play().catch(()=>{}); };
  }

  $("#btnDone").onclick = () => {
    state.done[id] = !state.done[id];
    if(state.done[id]) state.lastCompleted = new Date().toISOString();
    saveState();
    openModule(id);
  };

  $("#btnNext").onclick = () => {
    const idx = APP_DATA.modules.findIndex(x => x.id === id);
    const next = APP_DATA.modules[idx + 1];
    if(next) openModule(next.id);
    else alert("¡Has completado todos los módulos! 🎉");
  };
}

/* ===== AYUDA RÁPIDA ===== */
function renderAudios(){
  const estados = (APP_DATA.audioStates || []).map(a => `
    <div class="item" onclick="playDirect('${a.file}')" style="cursor:pointer; padding:15px; margin-bottom:15px; background:var(--soft); border-radius:20px; display:flex; align-items:center;">
      <img src="${a.image}" class="audioThumb"
        style="width:80px; height:80px; border-radius:15px; margin-right:15px; object-fit:cover; flex-shrink:0;"
        onerror="this.src='https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=150&q=60'">
      <div style="flex:1">
        <div style="font-weight:900; font-size:18px; color:var(--brand);">${a.title}</div>
        <div style="font-size:13px; color:var(--text); opacity:0.8;">${a.desc}</div>
      </div>
      <div style="background:var(--brand); color:white; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0;">▶</div>
    </div>
  `).join("");

  screen.innerHTML = `
    <section class="card" style="border:2px solid var(--accent); background:#fffcf9;">
      <h2 class="h2" style="color:var(--brand);">🆘 Ayuda Ahora</h2>
      <p class="p" style="margin-bottom:20px;">No luches sola. Elige cómo te sientes y escucha el audio:</p>
      <div class="list">${estados}</div>
      <div id="playerContainer" style="display:none; margin-top:20px; padding:15px; background:white; border-radius:15px; box-shadow:var(--shadow);">
        <p style="font-weight:800; font-size:14px; margin-bottom:10px; text-align:center;">Reproduciendo audio de calma...</p>
        <audio id="quickPlayer" controls style="width:100%;"></audio>
      </div>
    </section>
  `;
}

window.playDirect = (file) => {
  const container = document.getElementById("playerContainer");
  const player = document.getElementById("quickPlayer");
  if(!container || !player) return;
  container.style.display = "block";
  player.src = file;
  player.play().catch(()=>{});
  container.scrollIntoView({ behavior:"smooth" });
};

/* ===== PROGRESS ===== /
function renderProgress(){
  const {done, total, pct} = stats();

  let message = "Cada paso cuenta. Lo importante es empezar.";
  let icon = "🌱";
  if(pct > 0)  { message = "¡Ya has empezado! El primer paso es el más difícil."; icon = "🌿"; }
  if(pct > 30) { message = "Lo estás haciendo genial. Tu cuerpo agradece esta calma."; icon = "✨"; }
  if(pct > 60) { message = "¡Casi lo tienes! Estás transformando tu relación con la comida."; icon = "🧘"; }
  if(pct >= 100){ message = "¡Increíble! Has completado el programa. Eres pura inspiración."; icon = "👑"; }

  screen.innerHTML = `
    <section class="card" style="text-align:center; padding:40px 20px">
      <div style="font-size:64px; margin-bottom:10px">${icon}</div>
      <h2 class="h2" style="margin-bottom:8px">Tu Transformación</h2>
      <p class="p" style="font-style:italic; color:var(--brand); font-weight:600">"${message}"</p>

      <div class="progress-container">
        <div class="progress-bar" style="width:${pct}%"></div>
      </div>
      <p class="p" style="margin-top:10px">Has completado el <b>${pct}%</b> del camino</p>

      <div class="grid2" style="margin-top:24px">
        <div class="kpi"><b>${done}</b>