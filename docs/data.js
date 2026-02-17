window.APP_DATA = {
  modules: [
    { id: "module-1", title: "Módulo 1 · Calma al comenzar", file: "./audio/module-1.mp3", daily: "./audio/module-1-daily.mp3" },
    { id: "module-2", title: "Módulo 2 · Hambre emocional", file: "./audio/module-2.mp3", daily: "./audio/module-2-daily.mp3" },
    { id: "module-3", title: "Módulo 3 · Impulsos", file: "./audio/module-3.mp3", daily: "./audio/module-3-daily.mp3" },
    { id: "module-4", title: "Módulo 4 · Saciedad", file: "./audio/module-4.mp3", daily: "./audio/module-4-daily.mp3" },
    { id: "module-5", title: "Módulo 5 · Ansiedad", file: "./audio/module-5.mp3", daily: "./audio/module-5-daily.mp3" },
    { id: "module-6", title: "Módulo 6 · Hábitos", file: "./audio/module-6.mp3", daily: "./audio/module-6-daily.mp3" },
    { id: "module-7", title: "Módulo 7 · Mantenimiento", file: "./audio/module-7.mp3", daily: "./audio/module-7-daily.mp3" }
  ],

  // Pestaña Audios (app.js usa APP_DATA.audios)
  audios: [
    { id: "intro", title: "Intro · Cómo usar CalmaComida", file: "./audio/intro-curso.mp3" },
    { id: "m1", title: "Módulo 1 · Sesión principal", file: "./audio/module-1.mp3" },
    { id: "m1d", title: "Módulo 1 · Práctica diaria", file: "./audio/module-1-daily.mp3" },
    { id: "m2", title: "Módulo 2 · Sesión principal", file: "./audio/module-2.mp3" },
    { id: "m2d", title: "Módulo 2 · Práctica diaria", file: "./audio/module-2-daily.mp3" },
    { id: "m3", title: "Módulo 3 · Sesión principal", file: "./audio/module-3.mp3" },
    { id: "m3d", title: "Módulo 3 · Práctica diaria", file: "./audio/module-3-daily.mp3" },
    { id: "m4", title: "Módulo 4 · Sesión principal", file: "./audio/module-4.mp3" },
    { id: "m4d", title: "Módulo 4 · Práctica diaria", file: "./audio/module-4-daily.mp3" },
    { id: "m5", title: "Módulo 5 · Sesión principal", file: "./audio/module-5.mp3" },
    { id: "m5d", title: "Módulo 5 · Práctica diaria", file: "./audio/module-5-daily.mp3" },
    { id: "m6", title: "Módulo 6 · Sesión principal", file: "./audio/module-6.mp3" },
    { id: "m6d", title: "Módulo 6 · Práctica diaria", file: "./audio/module-6-daily.mp3" },
    { id: "m7", title: "Módulo 7 · Sesión principal", file: "./audio/module-7.mp3" },
    { id: "m7d", title: "Módulo 7 · Práctica diaria", file: "./audio/module-7-daily.mp3" }
  ]
};

// IMPORTANTÍSIMO: tu app.js usa también "APP_DATA" a secas.
// Esto lo define para que no salga undefined:
var APP_DATA = window.APP_DATA;
