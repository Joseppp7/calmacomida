const AUDIO_CDN = "https://joseppp7.github.io/calmacomida/audio/";
const AUDIO_QS  = "";

window.APP_DATA = {
  name: "CalmaComida",
  subtitle: "Tu refugio para una relación sana con la comida",
  priceLabel: "Acceso Premium Vitalicio - 47€",
  buyUrl: "https://tu-link-de-pago.com", 

  // Organización por estados emocionales para la pestaña Ayuda
  audioStates: [
    { 
      id: "impulso", 
      title: "Tengo un impulso", 
      desc: "Siento urgencia por comer ahora mismo.",
      image: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=300&q=60",
      file: AUDIO_CDN + "module-3-daily.mp3" 
    },
    { 
      id: "ansiedad", 
      title: "Siento ansiedad", 
      desc: "Nervios, tensión o vacío en el estómago.",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=60",
      file: AUDIO_CDN + "module-5-daily.mp3" 
    },
    { 
      id: "culpa", 
      title: "Siento culpa", 
      desc: "He comido de más y me siento mal.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=60",
      file: AUDIO_CDN + "module-1-daily.mp3" 
    }
  ],

  modules: [
    { id: "m1", title: "Módulo 1: Las bases de la calma", desc: "Aprende a escuchar las señales de tu cuerpo.", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=60", audio: AUDIO_CDN + "module-1-daily.mp3" },
    { id: "m2", title: "Módulo 2: Hambre emocional", desc: "¿Hambre real o hambre del corazón?", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=300&q=60", audio: AUDIO_CDN + "module-2-daily.mp3" },
    { 
  id: "m3",
  title: "Módulo 3: Herramientas para el impulso",
  desc: "Qué hacer en el momento de máxima urgencia.",
  image: "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?auto=format&fit=crop&w=300&q=60",
  audio: AUDIO_CDN + "module-3-daily.mp3"
},
    { id: "m4", title: "Módulo 4: Reconciliación con el espejo", desc: Sanando la imagen que ves cada día.", image: "https://images.unsplash.com/photo-1515377666659-81735e0ff046?auto=format&fit=crop&w=300&q=60", audio: AUDIO_CDN + "module-4-daily.mp3" },
    { id: "m5", title: "Módulo 5: Gestión de la ansiedad", desc: Técnicas de respiración y calma profunda.", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=300&q=60", audio: AUDIO_CDN + "module-5-daily.mp3" }
  ],

  testimonials: [
    { name: "Elena", text: "Por fin entiendo por qué comía con ansiedad. Esta app me ha cambiado la vida." },
    { name: "Marcos", text: "Los audios de ayuda rápida son mi salvavidas diario." }
  ]
};