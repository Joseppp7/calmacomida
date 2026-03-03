/* CalmaComida app.js — PRIME (estable + acabado visual) */
(function () {
  var screen = document.getElementById("screen");
  var btnReset = document.getElementById("btnReset");

  var STORAGE_KEY = "calmacomida_state_v4_prime";
  var state = { done: {}, lastTab: "home" };

  function loadState() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s) state = JSON.parse(s);
    } catch (e) {}
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function stats() {
    var mods = (window.APP_DATA && window.APP_DATA.modules) ? window.APP_DATA.modules : [];
    var total = mods.length;
    var done = 0;
    for (var k in (state.done || {})) if (state.done[k]) done++;
    var pct = total ? Math.round((done / total) * 100) : 0;
    return { total: total, done: done, pct: pct };
  }

  function setActiveTab(tab) {
    state.lastTab = tab;
    saveState();

    var tabs = document.querySelectorAll(".tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("active", tabs[i].getAttribute("data-tab") === tab);
    }
    render(tab);
    window.scrollTo(0, 0);
  }

  function findAudio(id) {
    var list = (window.APP_DATA && window.APP_DATA.audios) ? window.APP_DATA.audios : [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function render(tab) {
    if (!window.APP_DATA) {
      screen.innerHTML =
        '<div class="card"><h2 class="h2" style="color:#b00020">Error</h2>' +
        '<p class="p">No se cargó <b>data.js</b> (APP_DATA no existe).</p></div>';
      return;
    }
    if (tab === "home") renderHome();
    else if (tab === "modules") renderModules();
    else if (tab === "audio") renderAudios();
    else if (tab === "progress") renderProgress();
    else renderHome();
  }

  function renderHome() {
    var s = stats();
    var intro = findAudio("intro");
    var cierre = findAudio("cierre");

    var heroImg = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=70";

    screen.innerHTML =
      '<section class="hero">' +
        '<img class="heroImg" src="' + heroImg + '" alt="" />' +
        '<div class="heroContent">' +
          '<h2 class="heroTitle">Calma, claridad y elección</h2>' +
          '<p class="heroText">Usa la Introducción una vez, y luego cada módulo con su práctica diaria. No es fuerza de voluntad: es reentrenar tu sistema nervioso.</p>' +
        '</div>' +
      '</section>' +

      '<section class="card" style="margin-top:16px">' +
        '<h2 class="h2">Empieza por aquí</h2>' +
        '<p class="p">1) Escucha la Introducción. 2) Haz los módulos. 3) Repite prácticas diarias cuando lo necesites.</p>' +

        '<div class="list">' +
          itemPlay(intro, "Introducción (una vez)") +
          itemNav("Ir a Módulos", "Tus 7 módulos con 2 audios cada uno", "modules") +
          itemNav("Ir a Audios", "Introducción, prácticas y cierre", "audio") +
          itemPlay(cierre, "Cierre y mantenimiento") +
        '</div>' +

        '<div style="margin-top:14px">' +
          '<div class="progress-container"><div class="progress-bar" style="width:' + s.pct + '%"></div></div>' +
          '<p class="p" style="margin-top:10px"><b>Progreso:</b> ' + s.done + '/' + s.total + ' módulos (' + s.pct + '%)</p>' +
        '</div>' +

        '<audio id="globalPlayer" controls preload="metadata"></audio>' +
      '</section>';

    window.__playGlobal = function (file) {
      if (!file) return;
      var p = document.getElementById("globalPlayer");
      if (!p) return;
      p.src = file;
      p.play && p.play();
      p.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.__go = function (tab) { setActiveTab(tab); };
  }

  function itemPlay(a, hint) {
    if (!a) return (
      '<div class="item" style="opacity:.6; cursor:default">' +
        '<div style="flex:1">' +
          '<div class="itemTitle">' + esc(hint || "Audio") + '</div>' +
          '<div class="itemSub">No encontrado en data.js</div>' +
        '</div>' +
        '<div class="badge">—</div>' +
      '</div>'
    );
    return (
      '<div class="item" onclick="window.__playGlobal(\'' + esc(a.file) + '\')">' +
        '<div style="flex:1">' +
          '<div class="itemTitle">' + esc(hint || a.title) + '</div>' +
          '<div class="itemSub">' + esc(a.title) + '</div>' +
        '</div>' +
        '<div class="badge">▶ Reproducir</div>' +
      '</div>'
    );
  }

  function itemNav(title, sub, tab) {
    return (
      '<div class="item" onclick="window.__go(\'' + esc(tab) + '\')">' +
        '<div style="flex:1">' +
          '<div class="itemTitle">' + esc(title) + '</div>' +
          '<div class="itemSub">' + esc(sub || "") + '</div>' +
        '</div>' +
        '<div class="badge">Abrir</div>' +
      '</div>'
    );
  }

  function renderModules() {
    var mods = window.APP_DATA.modules || [];
    var html =
      '<section class="card">' +
        '<h2 class="h2">Módulos</h2>' +
        '<p class="p">Cada módulo tiene <b>audio principal</b> + <b>práctica diaria</b>.</p>' +
        '<div class="list">';

    for (var i = 0; i < mods.length; i++) {
      var m = mods[i];
      var done = !!(state.done && state.done[m.id]);
      html +=
        '<div class="item" onclick="window.__openModule(\'' + esc(m.id) + '\')">' +
          '<img class="audioThumb" src="' + esc(m.image || "") + '" onerror="this.style.display=\'none\'" alt="" />' +
          '<div style="flex:1">' +
            '<div class="itemTitle">' + esc(m.title) + '</div>' +
            '<div class="itemSub">' + esc(m.goal || "") + '</div>' +
          '</div>' +
          '<div class="badge ' + (done ? "done" : "") + '">' + (done ? "Hecho" : "Pendiente") + '</div>' +
        '</div>';
    }

    html += '</div></section>';
    screen.innerHTML = html;

    window.__openModule = function (id) {
      for (var j = 0; j < mods.length; j++) if (mods[j].id === id) return openModule(mods[j]);
    };
  }

  function openModule(m) {
    var done = !!(state.done && state.done[m.id]);

    screen.innerHTML =
      '<section class="card">' +
        '<button class="chip" onclick="window.__backMods()">← Volver</button>' +

        '<div style="margin-top:12px">' +
          '<img src="' + esc(m.image || "") + '" onerror="this.style.display=\'none\'" style="width:100%;height:190px;object-fit:cover;border-radius:16px;border:1px solid rgba(0,0,0,.06)" alt="" />' +
        '</div>' +

        '<h2 class="h2" style="margin-top:14px">' + esc(m.title) + '</h2>' +

        (m.goal ? '<p class="p"><b>Objetivo:</b> ' + esc(m.goal) + '</p>' : '') +
        (m.practice ? '<p class="p" style="margin-top:10px"><b>Cómo practicar:</b> ' + esc(m.practice) + '</p>' : '') +
        (m.expect ? '<p class="p" style="margin-top:10px"><b>Qué esperar:</b> ' + esc(m.expect) + '</p>' : '') +

        '<div class="card" style="margin-top:14px; background:var(--soft)">' +
          '<div class="itemTitle">🎧 Audio principal</div>' +
          '<audio controls preload="metadata" src="' + esc(m.audio || "") + '"></audio>' +
        '</div>' +

        '<div class="card" style="margin-top:12px; background:var(--soft)">' +
          '<div class="itemTitle">🧘 Práctica diaria</div>' +
          '<div class="itemSub">Úsala 1 vez al día (o antes de una comida) durante la semana.</div>' +
          '<audio controls preload="metadata" src="' + esc(m.daily || "") + '"></audio>' +
        '</div>' +

        '<button class="btn" id="btnDone" style="margin-top:14px">' +
          (done ? "✅ Módulo completado (toca para desmarcar)" : "Marcar módulo como hecho") +
        '</button>' +
      '</section>';

    window.__backMods = function(){ setActiveTab("modules"); };

    var b = document.getElementById("btnDone");
    b.onclick = function () {
      state.done = state.done || {};
      state.done[m.id] = !state.done[m.id];
      saveState();
      openModule(m);
    };
  }

 function renderAudios() {
    var sos = window.APP_DATA.ayudaSOS || [];
    var otros = window.APP_DATA.audios || [];
    
    var html = '<section class="card">' +
               '<h2 class="h2">🆘 Ayuda Rápida</h2>' +
               '<p class="p">Elige lo que sientes ahora mismo para recibir ayuda inmediata.</p>' +
               '<div class="list">';

    // 1. Botones SOS con Imagen y Texto
    for (var i = 0; i < sos.length; i++) {
      var s = sos[i];
      html +=
        '<div class="item" style="padding:0; overflow:hidden; flex-direction:column; align-items:stretch" onclick="window.__playSOS(\'' + esc(s.file) + '\', \'' + esc(s.title) + '\')">' +
          '<img src="' + esc(s.image) + '" style="width:100%; height:100px; object-fit:cover; border-radius:0" />' +
          '<div style="padding:14px">' +
            '<div class="itemTitle">' + esc(s.title) + '</div>' +
            '<div class="itemSub" style="margin-top:4px">' + esc(s.desc) + '</div>' +
          '</div>' +
        '</div>';
    }

    html += '</div></section>';

    // 2. Lista de otros audios (Intro, Cierre, etc.)
    html += '<section class="card" style="margin-top:16px">' +
            '<h2 class="h2">🎧 Todos los Audios</h2>' +
            '<div class="list">';
    
    for (var j = 0; j < otros.length; j++) {
      var a = otros[j];
      html +=
        '<div class="item" onclick="window.__playSOS(\'' + esc(a.file) + '\', \'' + esc(a.title) + '\')">' +
          '<div style="flex:1">' +
            '<div class="itemTitle">' + esc(a.title) + '</div>' +
            '<div class="itemSub">Toca para escuchar</div>' +
          '</div>' +
          '<div class="badge">▶</div>' +
        '</div>';
    }

    html += '</div>' +
            '<div id="sosPlayerBox" style="display:none; margin-top:20px; padding:16px; background:var(--soft); border-radius:16px; border:1px solid var(--accent)">' +
              '<div id="sosTitle" style="font-weight:900; color:var(--brand); margin-bottom:10px"></div>' +
              '<audio id="sosAudio" controls style="width:100%"></audio>' +
            '</div>' +
            '</section>';

    screen.innerHTML = html;

    window.__playSOS = function(file, title) {
      var box = document.getElementById("sosPlayerBox");
      var t = document.getElementById("sosTitle");
      var p = document.getElementById("sosAudio");
      t.textContent = "Reproduciendo: " + title;
      box.style.display = "block";
      p.src = file;
      p.play();
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    };
  }

  function renderProgress() {
    var s = stats();
    screen.innerHTML =
      '<section class="card">' +
        '<h2 class="h2">Tu transformación</h2>' +
        '<p class="p">Pequeños pasos, repetidos. Eso cambia el patrón.</p>' +
        '<div style="margin-top:14px">' +
          '<div class="progress-container"><div class="progress-bar" style="width:' + s.pct + '%"></div></div>' +
          '<p class="p" style="margin-top:10px"><b>' + s.done + '/' + s.total + '</b> módulos (' + s.pct + '%)</p>' +
        '</div>' +
      '</section>';
  }

  function wireReset() {
    if (!btnReset) return;
    btnReset.onclick = function () {
      if (confirm("¿Reiniciar progreso?")) {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        state = { done: {}, lastTab: "home" };
        setActiveTab("home");
      }
    };
  }

  function wireTabs() {
    var tabs = document.querySelectorAll(".tab");
    for (var i = 0; i < tabs.length; i++) {
      (function (btn) {
        btn.onclick = function () { setActiveTab(btn.getAttribute("data-tab")); };
      })(tabs[i]);
    }
  }

  function registerSW() {
    try {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js");
      }
    } catch (e) {}
  }

  // Init
  loadState();
  wireReset();
  wireTabs();
  registerSW();
  setActiveTab(state.lastTab || "home");
})();