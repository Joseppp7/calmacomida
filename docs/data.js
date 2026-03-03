var AUDIO_PATH = "./audio/";

window.APP_DATA = {
  modules: [
    { id: "m1", title: "Módulo 1: Las bases de la calma", goal: "Bajar la velocidad al comer.", practice: "Usa la práctica diaria antes de comer.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=60", audio: AUDIO_PATH + "module-1.mp3", daily: AUDIO_PATH + "module-1-daily.mp3" },
    { id: "m2", title: "Módulo 2: Hambre emocional", goal: "Diferenciar hambre física de emocional.", practice: "Identifica tu emoción antes de comer.", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=60", audio: AUDIO_PATH + "module-2.mp3", daily: AUDIO_PATH + "module-2-daily.mp3" },
    { id: "m3", title: "Módulo 3: Impulsos", goal: "Retrasar la reacción automática.", practice: "Espera 2 minutos antes de ceder al impulso.", image: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=300&q=60", audio: AUDIO_PATH + "module-3.mp3", daily: AUDIO_PATH + "module-3-daily.mp3" },
    { id: "m4", title: "Módulo 4: Saciedad", goal: "Reconectar con la sensación de estar llena.", practice: "Para a mitad de plato y observa tu estómago.", image: "https://images.unsplash.com/photo-1515377666659-81735e0ff046?auto=format&fit=crop&w=300&q=60", audio: AUDIO_PATH + "module-4.mp3", daily: AUDIO_PATH + "module-4-daily.mp3" },
    { id: "m5", title: "Módulo 5: Gestión de la ansiedad", goal: "Regular los nervios sin comida.", practice: "Respira lento 1 minuto antes de decidir comer.", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=60", audio: AUDIO_PATH + "module-5.mp3", daily: AUDIO_PATH + "module-5-daily.mp3" },
    { id: "m6", title: "Módulo 6: Hábitos", goal: "Crear rutinas automáticas sanas.", practice: "Repite una pequeña acción cada día.", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=60", audio: AUDIO_PATH + "module-6.mp3", daily: AUDIO_PATH + "module-6-daily.mp3" },
    { id: "m7", title: "Módulo 7: Mantenimiento", goal: "Mantener los cambios para siempre.", practice: "Usa los audios solo cuando lo necesites.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&q=60", audio: AUDIO_PATH + "module-7.mp3", daily: AUDIO_PATH + "module-7-daily.mp3" }
  ],
  audios: [
    { id: "intro", title: "Introducción al curso", file: AUDIO_PATH + "intro-curso.mp3" },
    { id: "cierre", title: "Cierre y mantenimiento", file: AUDIO_PATH + "cierre-mantenimiento.mp3" }
  ]
};

var APP_DATA = window.APP_DATA;