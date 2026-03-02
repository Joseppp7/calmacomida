const AUDIO_CDN = "https://joseppp7.github.io/calmacomida/audio/";
const AUDIO_QS  = "?raw=true";

window.APP_DATA = {
  name: "CalmaComida",
  subtitle: "Tu refugio para una relación sana con la comida",
  priceLabel: "Acceso Premium Vitalicio",
  buyUrl: "https://tu-link-de-pago.com", // CAMBIA ESTO POR TU LINK REAL
  
  // SECCIÓN DE AYUDA RÁPIDA (CON 3 IMÁGENES DISTINTAS)
  audioStates: [
    { 
      id: "impulso", 
      title: "Tengo un impulso", 
      desc: "Siento urgencia por comer ahora mismo.",
      image: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=300&q=60",
      file: AUDIO_CDN + "module-3-daily.mp3" + AUDIO_QS 
    },
    { 
      id: "ansiedad", 
      title: "Siento ansiedad", 
      desc: "Nervios, tensión o vacío en el estómago.",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=60",
      file: AUDIO_CDN + "module-5-daily.mp3" + AUDIO_QS 
    },
    { 
      id: "culpa", 
      title: "Siento culpa", 
      desc: "He comido de más y me siento mal.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=60",
      file: AUDIO_CDN + "module-1-daily.mp3" + AUDIO_QS 
    }
  ],

  // LISTADO DE MÓDULOS
  modules: [
    { 
      id: "m1", 
      title: "Módulo 1: Las bases de la calma", 
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=60",
      audio: AUDIO_CDN + "module-1-daily.mp3" + AUDIO_QS 
    },
    { 
      id: "m2", 
      title: "Módulo 2: Identificando el hambre emocional", 
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=60",
      audio: AUDIO_CDN + "module-2-daily.mp3" + AUDIO_QS 
    },
    { 
      id: "m3", 
      title: "Módulo 3: Herramientas para el impulso", 
      image: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=300&q=60",
      audio: AUDIO_CDN + "module-3-daily.mp3" + AUDIO_QS 
    },
    { 
      id: "m4", 
      title: "Módulo 4: Reconciliación con el espejo", 
      image: "https://images.unsplash.com/photo-1515377666659-81735e0ff046?auto=format&fit=crop&w=300&q=60",
      audio: AUDIO_CDN + "module-4-daily.mp3" + AUDIO_QS 
    },
    { 
      id: "m5", 
      title: "Módulo 5: Gestión de la ansiedad", 
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=60",
      audio: AUDIO_CDN + "module-5-daily.mp3" + AUDIO_QS 
    }
  ]
};