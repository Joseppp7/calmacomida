// === BOOTSTRAP: asegura APP_DATA antes de usarlo (Android/PWA safe) ===
(function waitForData(){
  if (window.APP_DATA) {
    // crea alias global si falta
    if (typeof window.APP_DATA !== "undefined" && typeof APP_DATA === "undefined") {
      window.APP_DATA_ALIAS = window.APP_DATA; // por si acaso
      // eslint-disable-next-line no-var
      var APP_DATA = window.APP_DATA;
      window.APP_DATA = window.APP_DATA; // no-op
    }
    return; // sigue cargando el resto del fichero
  }
  // reintenta hasta 2s
  if (!window.__DATA_WAIT_START) window.__DATA_WAIT_START = Date.now();
  if (Date.now() - window.__DATA_WAIT_START > 2000) {
    document.body.innerHTML = `<pre style="padding:12px">[CalmaComida ERROR]\nNo se cargó data.js (window.APP_DATA no existe).</pre>`;
    return;
  }
  setTimeout(waitForData, 50);
})();
// DEBUG_MOBILE_ERRORS_v1

// Fuente única de datos (evita líos entre APP_DATA y window.APP_DATA)
const DATA = (window.APP_DATA || (typeof APP_DATA !== "undefined" ? APP_DATA : null));

if (!DATA) {
  console.error("No hay DATA (APP_DATA/window.APP_DATA). Revisa data.js");
}
// --- DEBUG: mostrar errores en pantalla (Android) ---
(function () {
  function show(msg) {
    const el = document.getElementById("screen") || document.body;
    const box = document.createElement("pre");
    box.style.whiteSpace = "pre-wrap";
    box.style.padding = "12px";
    box.style.margin = "12px";
    box.style.borderRadius = "12px";
    box.style.background = "#2b1d1d";
    box.style.color = "#ffd2d2";
    box.style.fontSize = "13px";
    box.textContent = "[CalmaComida ERROR]\n\n" + msg;
    el.innerHTML = "";
    el.appendChild(box);
  }

  window.addEventListener("error", (e) => {
    show((e.message || "Error") + "\n" + (e.filename || "") + ":" + (e.lineno || "") + ":" + (e.colno || ""));
  });

  window.addEventListener("unhandledrejection", (e) => {
    show("Promise rejection:\n" + (e.reason?.stack || e.reason || "unknown"));
  });
})();
const $ = (sel) => document.querySelector(sel);
const screen = $("#screen");

const STORAGE_KEY = "calmacomida_state_v3";

let state = loadState();

function loadState(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      done: {},
      lastTab: "home"
    };
  }catch{
    return { done:{}, lastTab:"home" };
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function stats(){
  const total = APP_DATA.modules.length;
  const done = Object.values(state.done).filter(Boolean).length;
  const pct = total ? Math.round((done/total)*100) : 0;
  return { total, done, pct };
}

function setActiveTab(tab){
  document.querySelectorAll(".tab").forEach(b=>{
    b.classList.toggle("active", b.dataset.tab === tab);
  });
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

/* ---------------- HOME ---------------- */
function renderHome(){
  const {done, total, pct} = stats();

  screen.innerHTML = `
    <section class="hero">
      <img class="heroImg" src="${APP_DATA.coverImage || ""}" alt="Portada"
           onerror="this.style.display='none'">
      <div class="heroContent">
        <p class="heroTitle">Tu relación con la comida puede volverse más ligera</p>
        <p class="heroText">
          Hoy: un paso pequeño, amable y realista. No es fuerza de voluntad: es regulación + hábito.
        </p>
      </div>
    </section>

    <section class="card" style="margin-top:12px">
      <img class="heroImage" src="./img/portada.jpg" alt="Portada CalmaComida">
<h2 class="h2">Cómo usar la app</h2>
      <p class="p">
        1) Entra en <b>Módulos</b> y abre el módulo de hoy.<br>
        2) Escucha el audio + haz la práctica.<br>
        3) Marca “Terminado” (se guarda en este dispositivo).
      </p>
      <div class="row">
        <button class="btn" id="goModules">Empezar</button>
        <button class="btn ghost" id="goAudio">Audios</button>
      </div>
    </section>

    <section class="card">
      <h2 class="h2">Tu progreso</h2>
      <div class="grid2">
        <div class="kpi"><b>${pct}%</b><small>Completado</small></div>
        <div class="kpi"><b>${done}/${total}</b><small>Módulos marcados</small></div>
      </div>
    </section>
  `;

  $("#goModules").onclick = ()=> setActiveTab("modules");
  $("#goAudio").onclick = ()=> setActiveTab("audio");
}

/* ---------------- MODULES LIST ---------------- */
function renderModules(){
  const items = APP_DATA.modules.map(m=>{
    const isDone = !!state.done[m.id];
    return `
      <div class="item" data-open="${m.id}" style="cursor:pointer">
        <div>
          <div class="itemTitle">${(m.title || m.name || m.label || ("Módulo " + m.id))}</div>

          <div class="itemSub">${m.desc || ""}</div>
        </div>
        <div style="display:flex; gap:8px; align-items:center">
          <span class="badge">${isDone ? "✅ Hecho" : "Pendiente"}</span>
        </div>
      </div>
    `;
  }).join("");

  screen.innerHTML = `
    <section class="card">
      <h2 class="h2">Módulos</h2>
      <p class="p">Toca un módulo para abrir su pantalla completa.</p>
      <div class="list">${items}</div>
    </section>
  `;

  screen.querySelectorAll("[data-open]").forEach(el=>{
    el.onclick = ()=>{
      const id = el.dataset.open;
      openModule(id);
    };
  });
}

/* ---------------- MODULE DETAIL ---------------- */
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

      <!-- IMAGEN SUGERENTE DEL MÓDULO -->
      <div class="moduleHero">
        <img class="moduleHeroImg" src="${m.image || ""}" alt="Imagen del módulo"
             onerror="this.style.display='none'">
        <div class="moduleHeroOverlay">
          <div class="moduleHeroCaption">${m.phrase || ""}</div>
        </div>
      </div>

      <div style="margin-top:12px">
        <div class="kpi" style="background:var(--soft)">
          <b>Objetivo</b>
          <small>${m.objective || "—"}</small>
        </div>
      </div>

      <div style="margin-top:10px">
        <div class="kpi" style="background:var(--soft)">
          <b>Práctica</b>
          <small>${m.practice || "—"}</small>
        </div>
      </div>

      <div class="audioBox">
        <div style="font-weight:900; margin-bottom:8px">Audio del módulo</div>
        ${m.audio ? `<audio id="player" controls src="${m.audio}"></audio>` : `<p class="p">Este módulo aún no tiene audio asignado.</p>`}
      </div>

      <div class="row">
        <button class="btn" id="btnDone">${isDone ? "Marcar como NO terminado" : "Marcar como terminado ✓"}</button>
        <button class="btn ghost" id="btnNext">Siguiente módulo →</button>
      </div>
    </section>
  `;

  $("#btnBack").onclick = ()=> renderModules();

  $("#btnDone").onclick = ()=>{
    state.done[id] = !state.done[id];
    saveState();
    openModule(id);
  };

  $("#btnNext").onclick = ()=>{
    const idx = window.APP_DATA.modules.findIndex(x => x.id === id);
    const next = APP_DATA.modules[idx + 1];
    if(next) openModule(next.id);
    else alert("Ya estás en el último módulo.");
  };
}

/* ---------------- AUDIOS ---------------- */
function renderAudios(){
  const items = ((APP_DATA.audios || window.APP_DATA?.audios) || []).map(a=>`

    <div class="item">
      <div class="itemTitle">${a.title}</div>
      <button class="chip" data-audio="${a.file || a.src}"
 title="Reproducir">▶</button>
    </div>
  `).join("");

  screen.innerHTML = `
    <section class="card">
      <h2 class="h2">Audios</h2>
      <p class="p">Repite prácticas cuando lo necesites.</p>

      <div class="list">${items}</div>

      <div class="audioBox">
        <audio id="player2" controls></audio>
      </div>
    </section>
  `;

  screen.querySelectorAll("[data-audio]").forEach(btn=>{
    btn.onclick = ()=>{
      $("#player2").src = btn.dataset.audio;
      $("#player2").play().catch(()=>{});
    };
  });
}

/* ---------------- PROGRESS ---------------- */
function renderProgress(){
  const {done, total, pct} = stats();
  screen.innerHTML = `
    <section class="card">
      <h2 class="h2">Progreso</h2>
      <p class="p"><b>${pct}%</b> completado (${done}/${total}).</p>

      <div class="row">
        <button class="btn" id="toModules">Ver módulos</button>
        <button class="btn ghost" id="toHome">Inicio</button>
      </div>
    </section>
  `;
  $("#toModules").onclick = ()=> setActiveTab("modules");
  $("#toHome").onclick = ()=> setActiveTab("home");
}

/* ---------------- SW + RESET ---------------- */
function registerSW(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  }
}

$("#btnReset").addEventListener("click", ()=>{
  if(confirm("¿Borrar el progreso guardado en este dispositivo?")){
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    setActiveTab("home");
  }
});

/* ---------------- START ---------------- */
document.getElementById("appTitle").textContent = APP_DATA.name;
document.getElementById("appSubtitle").textContent = APP_DATA.subtitle;

document.querySelectorAll(".tab").forEach(btn=>{
  btn.addEventListener("click", ()=> setActiveTab(btn.dataset.tab));
});

registerSW();
setActiveTab(state.lastTab || "home");
