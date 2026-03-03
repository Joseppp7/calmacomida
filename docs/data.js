const AUDIO_PATH = "./audio/";

window.APP_DATA = {
  name: "CalmaComida",
  subtitle: "Programa de 7 pasos para sanar tu relación con la comida",

  // Audios de bienvenida y despedida
  extras: {
    intro: { 
      title: "1. Introducción al curso", 
      desc: "Escucha esto antes de empezar cualquier módulo para entender el método.", 
      file: AUDIO_PATH + "intro-curso.mp3" 
    },
    cierre: { 
      title: "2. Cierre y Mantenimiento", 
      desc: "Escúchalo al finalizar los 7 módulos para integrar el cambio a largo plazo.", 
      file: AUDIO_PATH + "cierre-mantenimiento.mp3" 
    }
  },

  // Los 7 Módulos con doble audio
  modules: [
    { id: "m1", title: "Módulo 1: Las bases de la calma", desc: "Aprende a escuchar las señales reales de tu cuerpo.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=60", audioMain: AUDIO_PATH + "module-1.mp3", audioDaily: AUDIO_PATH + "module-1-daily.mp3" },
    { id: "m2", title: "Módulo 2: Hambre emocional", desc: "¿Hambre real o hambre del corazón? Identifícalo.", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=60", audioMain: AUDIO_PATH + "module-2.mp3", audioDaily: AUDIO_PATH + "module-2-daily.mp3" },
    { id: "m3", title: "Módulo 3: Herramientas para el impulso", desc: Qué hacer en el momento de máxima urgencia.", image: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=300&q=60", audioMain: AUDIO_PATH + "module-3.mp3", audioDaily: AUDIO_PATH + "module-3-daily.mp3" },
    { id: "m4", title: "Módulo 4: Reconciliación con el espejo", desc: Sanando la imagen que ves cada día.", image: "https://images.unsplash.com/photo-1515377666659-81735e0ff046?auto=format&fit=crop&w=300&q=60", audioMain: AUDIO_PATH + "module-4.mp3", audioDaily: AUDIO_PATH + "module-4-daily.mp3" },
    { id: "m5", title: "Módulo 5: Gestión de la ansiedad", desc: Técnicas de respiración y calma profunda.", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=60", audioMain: AUDIO_PATH + "module-5.mp3", audioDaily: AUDIO_PATH + "module-5-daily.mp3" },
    { id: "m6", title: "Módulo 6: Alimentación consciente", desc: Disfruta de cada bocado con presencia plena.", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=60", audioMain: AUDIO_PATH + "module-6.mp3", audioDaily: AUDIO_PATH + "module-6-daily.mp3" },
    { id: "m7", title: "Módulo 7: Manteniendo el cambio", desc: Estrategias para que tu nueva relación dure siempre.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&q=60", audioMain: AUDIO_PATH + "module-7.mp3", audioDaily: AUDIO_PATH + "module-7-daily.mp3" }
  ],

  // Ayuda rápida (SOS)
  helpNow: [
    { id: "impulso", title: "Tengo un impulso", desc: "Usa esto para frenar el piloto automático ahora.", image: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=300&q=60", file: AUDIO_PATH + "module-3-daily.mp3" },
    { id: "ansiedad", title: "Siento ansiedad", desc: "Para bajar la intensidad y volver a la calma.", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=60", file: AUDIO_PATH + "module-5-daily.mp3" },
    { id: "culpa", title: "Siento culpa", desc: "Para ser amable contigo tras un momento difícil.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=60", file: AUDIO_PATH + "module-1-daily.mp3" }
  ]
};