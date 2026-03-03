// data.js — COMPATIBILIDAD TOTAL
var AUDIO_CDN = "https://github.com/Joseppp7/calmacomida/releases/download/audio-v1/";
var AUDIO_QS = "?raw=1";

window.APP_DATA = {
  name: "CalmaComida",
  subtitle: "Calma · Claridad · Elección",
  
  // ESTO ES LO QUE BUSCA TU APP.JS
  audioStates: [
    {
      id: "impulso",
      title: "Tengo un impulso ahora",
      desc: "Para 2 minutos antes de decidir. Este audio te ayuda a recuperar el control.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=60",
      file: AUDIO_CDN + "module-3-daily.mp3" + AUDIO_QS
    },
    {
      id: "ansiedad",
      title: "Siento ansiedad",
      desc: "Vamos a bajar la activación del cuerpo antes de usar comida para calmarla.",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&q=60",
      file: AUDIO_CDN + "module-5-daily.mp3" + AUDIO_QS
    },
    {
      id: "culpa",
      title: "Me siento culpable por haber comido",
      desc: "La culpa alimenta el ciclo. Escucha esto para romperlo.",
      image: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=400&q=60",
      file: AUDIO_CDN + "module-7-daily.mp3" + AUDIO_QS
    }
  ],

  modules: [
    { id: "m1", title: "Módulo 1: Calma al comenzar", goal: "Bajar la velocidad mental.", image: "./img/module-1.jpg", audio: AUDIO_CDN + "module-1.mp3" + AUDIO_QS, daily: AUDIO_CDN + "module-1-daily.mp3" + AUDIO_QS },
    { id: "m2", title: "Módulo 2: Hambre emocional", goal: "Diferenciar hambres.", image: "./img/module-2.jpg", audio: AUDIO_CDN + "module-2.mp3" + AUDIO_QS, daily: AUDIO_CDN + "module-2-daily.mp3" + AUDIO_QS },
    { id: "m3", title: "Módulo 3: Impulsos", goal: "Retrasar la reacción.", image: "./img/module-3.jpg", audio: AUDIO_CDN + "module-3.mp3" + AUDIO_QS, daily: AUDIO_CDN + "module-3-daily.mp3" + AUDIO_QS },
    { id: "m4", title: "Módulo 4: Saciedad", goal: "Reconectar con la plenitud.", image: "./img/module-4.jpg", audio: AUDIO_CDN + "module-4.mp3" + AUDIO_QS, daily: AUDIO_CDN + "module-4-daily.mp3" + AUDIO_QS },
    { id: "m5", title: "Módulo 5: Gestión de la ansiedad", goal: "Regular nervios.", image: "./img/module-5.jpg", audio: AUDIO_CDN + "module-5.mp3" + AUDIO_QS, daily: AUDIO_CDN + "module-5-daily.mp3" + AUDIO_QS },
    { id: "m6", title: "Módulo 6: Hábitos", goal: "Crear rutinas sanas.", image: "./img/module-6.jpg", audio: AUDIO_CDN + "module-6.mp3" + AUDIO_QS, daily: AUDIO_CDN + "module-6-daily.mp3" + AUDIO_QS },
    { id: "m7", title: "Módulo 7: Mantenimiento", goal: "Mantener los cambios.", image: "./img/module-7.jpg", audio: AUDIO_CDN + "module-7.mp3" + AUDIO_QS, daily: AUDIO_CDN + "module-7-daily.mp3" + AUDIO_QS }
  ],

  audios: [
    { id: "intro", title: "Introducción al curso", file: AUDIO_CDN + "intro-curso.mp3" + AUDIO_QS },
    { id: "cierre", title: "Cierre y mantenimiento", file: AUDIO_CDN + "cierre-mantenimiento.mp3" + AUDIO_QS }
  ]
};

// Aseguramos que ambas variables existan para evitar errores de carga
window.APP_DATA = window.APP_DATA;
var APP_DATA = window.APP_DATA;