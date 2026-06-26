// Multi-language support for Echoes of the Estate

export const translations = {
  en: {
    // Language names
    languageName: "English",
    
    // Welcome Screen
    welcome: {
      title: "ECHOES OF THE ESTATE",
      subtitle: "Eleanor's Mansion Awaits...",
      enterButton: "APPROACH THE MANSION",
    },
    
    // Name Entry Modal
    nameEntry: {
      title: "ECHOES OF THE ESTATE",
      subtitle: "The Haunted Mansion Awaits",
      description: "Eleanor's melancholic presence lingers in every shadow. Who dares enter the estate?",
      placeholder: "Enter your name...",
      submitButton: "ENTER THE ESTATE",
      errorEmpty: "Please enter your name",
    },
    
    // Game Interface - Header
    header: {
      title: "Echoes of the Estate ",
      muteMusic: "🔊 Mute Music",
      unmuteMusic: "🔇 Unmute Music",
      saveLoadButton: "💾 Save/Load",
      languageButton: "🌐 Language",
    },
    
    // Save Menu
    saveMenu: {
      title: "💾 Save & Load Menu",
      generateTitle: "Generate a save code to transfer progress across devices:",
      generateButton: "Generate Save Code",
      codeLabel: "Your save code (click to copy):",
      copiedMessage: "Copied to clipboard!",
      loadTitle: "Load game from save code:",
      loadPlaceholder: "Paste your save code here...",
      loadButton: "Load Game",
      loadSuccess: "Progress loaded successfully!",
      loadError: "Invalid save code. Please try again.",
      enterCodeError: "Please enter a save code",
      newGameButton: "🗑️ New Game",
      newGameConfirm: "Start a new game? This will clear your current progress.",
      newGameSuccess: "Progress cleared. Starting fresh!",
      saveGenerated: "Save code generated! Copy it to use on any device.",
    },
    
    // Room Panel
    roomPanel: {
      availablePaths: "Available paths:",
      goTo: "Go to",
      movedTo: "You moved to the",
    },
    
    // Trust Meter
    trust: {
      label: "GHOST TRUST:",
    },
    
    // Chat
    chat: {
      aiCredit: "AI Powered by Claude | Music by Kevin MacLeod",
      you: "You",
      eleanor: "Eleanor",
      system: "System",
      placeholder: "Speak to the ghost...",
      sendButton: "Send",
      summoning: "Summoning...",
    },
    
    // System Messages
    systemMessages: {
      welcome: "Welcome to Echoes of the Estate. You sense a presence...",
      restored: "Previous progress restored. Welcome back to Echoes of the Estate...",
      errorConnecting: "Error connecting to ghost...",
      error: "Error:",
    },
    
    // Rooms
    rooms: {
      entrance: {
        name: "Grand Entrance Hall",
        description: "Thunder rumbles outside as rain lashes against cracked stained glass windows. A grand staircase spirals into darkness above.",
      },
      library: {
        name: "Forbidden Library",
        description: "Ancient tomes line towering shelves, their leather bindings cracked with age. The air smells of decay and old secrets.",
      },
      dining: {
        name: "Cursed Dining Room",
        description: "A long table set for twelve ghostly guests. Cobwebs drape the corners like funeral shrouds.",
      },
      garden: {
        name: "Dead Garden",
        description: "Withered roses choke the overgrown paths. The moon casts twisted shadows through gnarled trees.",
      },
      study: {
        name: "Eleanor's Study",
        description: "Personal journals lie scattered across an aged desk. Ink-stained letters reveal fragments of a melancholic past.",
      },
      kitchen: {
        name: "Abandoned Kitchen",
        description: "Rusted pots hang above a cold stove. Something dark stains the floor near the pantry.",
      },
    },
  },
  
  es: {
    // Spanish
    languageName: "Español",
    
    welcome: {
      title: "ECOS DE LA MANSIÓN",
      subtitle: "La Mansión de Eleanor Te Espera...",
      enterButton: "ACÉRCATE A LA MANSIÓN",
    },
    
    nameEntry: {
      title: "ECOS DE LA MANSIÓN",
      subtitle: "La Mansión Embrujada Aguarda",
      description: "La presencia melancólica de Eleanor persiste en cada sombra. ¿Quién se atreve a entrar a la mansión?",
      placeholder: "Ingresa tu nombre...",
      submitButton: "ENTRAR A LA MANSIÓN",
      errorEmpty: "Por favor ingresa tu nombre",
    },
    
    header: {
      title: "Ecos de la Mansión ",
      muteMusic: "🔊 Silenciar Música",
      unmuteMusic: "🔇 Activar Música",
      saveLoadButton: "💾 Guardar/Cargar",
      languageButton: "🌐 Idioma",
    },
    
    saveMenu: {
      title: "💾 Menú de Guardado y Carga",
      generateTitle: "Genera un código de guardado para transferir el progreso entre dispositivos:",
      generateButton: "Generar Código",
      codeLabel: "Tu código de guardado (haz clic para copiar):",
      copiedMessage: "¡Copiado al portapapeles!",
      loadTitle: "Cargar juego desde código:",
      loadPlaceholder: "Pega tu código aquí...",
      loadButton: "Cargar Juego",
      loadSuccess: "¡Progreso cargado exitosamente!",
      loadError: "Código inválido. Por favor intenta de nuevo.",
      enterCodeError: "Por favor ingresa un código",
      newGameButton: "🗑️ Juego Nuevo",
      newGameConfirm: "¿Iniciar un juego nuevo? Esto borrará tu progreso actual.",
      newGameSuccess: "¡Progreso borrado. Comenzando de nuevo!",
      saveGenerated: "¡Código generado! Cópialo para usar en cualquier dispositivo.",
    },
    
    roomPanel: {
      availablePaths: "Caminos disponibles:",
      goTo: "Ir a",
      movedTo: "Te moviste a",
    },
    
    trust: {
      label: "CONFIANZA DEL FANTASMA:",
    },
    
    chat: {
      aiCredit: "IA Potenciada por Claude | Música por Kevin MacLeod",
      you: "Tú",
      eleanor: "Eleanor",
      system: "Sistema",
      placeholder: "Habla con el fantasma...",
      sendButton: "Enviar",
      summoning: "Invocando...",
    },
    
    systemMessages: {
      welcome: "Bienvenido a Ecos de la Mansión. Sientes una presencia...",
      restored: "Progreso anterior restaurado. Bienvenido de vuelta a Ecos de la Mansión...",
      errorConnecting: "Error al conectar con el fantasma...",
      error: "Error:",
    },
    
    rooms: {
      entrance: {
        name: "Gran Vestíbulo de Entrada",
        description: "El trueno retumba afuera mientras la lluvia azota contra las ventanas de vitrales agrietados. Una gran escalera se eleva en espiral hacia la oscuridad.",
      },
      library: {
        name: "Biblioteca Prohibida",
        description: "Tomos antiguos cubren estantes imponentes, sus encuadernaciones de cuero agrietadas por la edad. El aire huele a decadencia y viejos secretos.",
      },
      dining: {
        name: "Comedor Maldito",
        description: "Una larga mesa preparada para doce invitados fantasmales. Las telarañas cubren las esquinas como sudarios funerarios.",
      },
      garden: {
        name: "Jardín Muerto",
        description: "Rosas marchitas ahogan los caminos cubiertos de maleza. La luna proyecta sombras retorcidas a través de árboles nudosos.",
      },
      study: {
        name: "Estudio de Eleanor",
        description: "Diarios personales yacen esparcidos sobre un escritorio envejecido. Cartas manchadas de tinta revelan fragmentos de un pasado melancólico.",
      },
      kitchen: {
        name: "Cocina Abandonada",
        description: "Ollas oxidadas cuelgan sobre una estufa fría. Algo oscuro mancha el suelo cerca de la despensa.",
      },
    },
  },
  
  pt: {
    // Portuguese
    languageName: "Português",
    
    welcome: {
      title: "ECOS DA MANSÃO",
      subtitle: "A Mansão de Eleanor Te Aguarda...",
      enterButton: "APROXIME-SE DA MANSÃO",
    },
    
    nameEntry: {
      title: "ECOS DA MANSÃO",
      subtitle: "A Mansão Assombrada Aguarda",
      description: "A presença melancólica de Eleanor permanece em cada sombra. Quem ousa entrar na mansão?",
      placeholder: "Digite seu nome...",
      submitButton: "ENTRAR NA MANSÃO",
      errorEmpty: "Por favor digite seu nome",
    },
    
    header: {
      title: " Ecos da Mansão ",
      muteMusic: "🔊 Silenciar Música",
      unmuteMusic: "🔇 Ativar Música",
      saveLoadButton: "💾 Salvar/Carregar",
      languageButton: "🌐 Idioma",
    },
    
    saveMenu: {
      title: "💾 Menu de Salvar e Carregar",
      generateTitle: "Gere um código de salvamento para transferir o progresso entre dispositivos:",
      generateButton: "Gerar Código",
      codeLabel: "Seu código de salvamento (clique para copiar):",
      copiedMessage: "Copiado para a área de transferência!",
      loadTitle: "Carregar jogo do código:",
      loadPlaceholder: "Cole seu código aqui...",
      loadButton: "Carregar Jogo",
      loadSuccess: "Progresso carregado com sucesso!",
      loadError: "Código inválido. Por favor, tente novamente.",
      enterCodeError: "Por favor, digite um código",
      newGameButton: "🗑️ Novo Jogo",
      newGameConfirm: "Iniciar um novo jogo? Isso apagará seu progresso atual.",
      newGameSuccess: "Progresso apagado. Começando do zero!",
      saveGenerated: "Código gerado! Copie-o para usar em qualquer dispositivo.",
    },
    
    roomPanel: {
      availablePaths: "Caminhos disponíveis:",
      goTo: "Ir para",
      movedTo: "Você se moveu para",
    },
    
    trust: {
      label: "CONFIANÇA DO FANTASMA:",
    },
    
    chat: {
      aiCredit: "IA Alimentada por Claude | Música por Kevin MacLeod",
      you: "Você",
      eleanor: "Eleanor",
      system: "Sistema",
      placeholder: "Fale com o fantasma...",
      sendButton: "Enviar",
      summoning: "Invocando...",
    },
    
    systemMessages: {
      welcome: "Bem-vindo aos Ecos da Mansão. Você sente uma presença...",
      restored: "Progresso anterior restaurado. Bem-vindo de volta aos Ecos da Mansão...",
      errorConnecting: "Erro ao conectar com o fantasma...",
      error: "Erro:",
    },
    
    rooms: {
      entrance: {
        name: "Grande Salão de Entrada",
        description: "O trovão retumba do lado de fora enquanto a chuva açoita as janelas de vitrais rachados. Uma grande escada sobe em espiral para a escuridão.",
      },
      library: {
        name: "Biblioteca Proibida",
        description: "Tomos antigos forram prateleiras imponentes, suas encadernações de couro rachadas pela idade. O ar cheira a decadência e velhos segredos.",
      },
      dining: {
        name: "Sala de Jantar Amaldiçoada",
        description: "Uma longa mesa preparada para doze convidados fantasmagóricos. Teias de aranha cobrem os cantos como mortalhas funerárias.",
      },
      garden: {
        name: "Jardim Morto",
        description: "Rosas murchas sufocam os caminhos cobertos de mato. A lua lança sombras retorcidas através de árvores retorcidas.",
      },
      study: {
        name: "Escritório de Eleanor",
        description: "Diários pessoais estão espalhados sobre uma mesa envelhecida. Cartas manchadas de tinta revelam fragmentos de um passado melancólico.",
      },
      kitchen: {
        name: "Cozinha Abandonada",
        description: "Panelas enferrujadas pendem sobre um fogão frio. Algo escuro mancha o chão perto da despensa.",
      },
    },
  },
  
  fr: {
    // French
    languageName: "Français",
    
    welcome: {
      title: "ÉCHOS DU MANOIR",
      subtitle: "Le Manoir d'Eleanor Vous Attend...",
      enterButton: "APPROCHEZ DU MANOIR",
    },
    
    nameEntry: {
      title: "ÉCHOS DU MANOIR",
      subtitle: "Le Manoir Hanté Attend",
      description: "La présence mélancolique d'Eleanor persiste dans chaque ombre. Qui ose entrer dans le manoir?",
      placeholder: "Entrez votre nom...",
      submitButton: "ENTRER DANS LE MANOIR",
      errorEmpty: "Veuillez entrer votre nom",
    },
    
    header: {
      title: " Échos du Manoir ",
      muteMusic: "🔊 Couper le Son",
      unmuteMusic: "🔇 Activer le Son",
      saveLoadButton: "💾 Sauvegarder/Charger",
      languageButton: "🌐 Langue",
    },
    
    saveMenu: {
      title: "💾 Menu de Sauvegarde et Chargement",
      generateTitle: "Générez un code de sauvegarde pour transférer la progression entre appareils:",
      generateButton: "Générer le Code",
      codeLabel: "Votre code de sauvegarde (cliquez pour copier):",
      copiedMessage: "Copié dans le presse-papiers!",
      loadTitle: "Charger le jeu depuis le code:",
      loadPlaceholder: "Collez votre code ici...",
      loadButton: "Charger le Jeu",
      loadSuccess: "Progression chargée avec succès!",
      loadError: "Code invalide. Veuillez réessayer.",
      enterCodeError: "Veuillez entrer un code",
      newGameButton: "🗑️ Nouvelle Partie",
      newGameConfirm: "Commencer une nouvelle partie? Cela effacera votre progression actuelle.",
      newGameSuccess: "Progression effacée. Nouveau départ!",
      saveGenerated: "Code généré! Copiez-le pour l'utiliser sur n'importe quel appareil.",
    },
    
    roomPanel: {
      availablePaths: "Chemins disponibles:",
      goTo: "Aller à",
      movedTo: "Vous vous êtes déplacé vers",
    },
    
    trust: {
      label: "CONFIANCE DU FANTÔME:",
    },
    
    chat: {
      aiCredit: "IA Propulsée par Claude | Musique par Kevin MacLeod",
      you: "Vous",
      eleanor: "Eleanor",
      system: "Système",
      placeholder: "Parlez au fantôme...",
      sendButton: "Envoyer",
      summoning: "Invocation...",
    },
    
    systemMessages: {
      welcome: "Bienvenue aux Échos du Manoir. Vous sentez une présence...",
      restored: "Progression précédente restaurée. Bienvenue de retour aux Échos du Manoir...",
      errorConnecting: "Erreur de connexion avec le fantôme...",
      error: "Erreur:",
    },
    
    rooms: {
      entrance: {
        name: "Grand Hall d'Entrée",
        description: "Le tonnerre gronde dehors tandis que la pluie fouette les vitraux fissurés. Un grand escalier monte en spirale vers l'obscurité.",
      },
      library: {
        name: "Bibliothèque Interdite",
        description: "Des tomes anciens tapissent de hautes étagères, leurs reliures de cuir craquelées par l'âge. L'air sent la décomposition et les vieux secrets.",
      },
      dining: {
        name: "Salle à Manger Maudite",
        description: "Une longue table dressée pour douze invités fantomatiques. Des toiles d'araignée drapent les coins comme des linceuls funéraires.",
      },
      garden: {
        name: "Jardin Mort",
        description: "Des roses fanées étouffent les sentiers envahis. La lune projette des ombres tordues à travers des arbres noueux.",
      },
      study: {
        name: "Bureau d'Eleanor",
        description: "Des journaux intimes sont éparpillés sur un bureau vieilli. Des lettres tachées d'encre révèlent des fragments d'un passé mélancolique.",
      },
      kitchen: {
        name: "Cuisine Abandonnée",
        description: "Des casseroles rouillées pendent au-dessus d'un poêle froid. Quelque chose de sombre tache le sol près du garde-manger.",
      },
    },
  },
  
  hi: {
    // Hindi
    languageName: "हिंदी",
    
    welcome: {
      title: "हवेली की प्रतिध्वनि",
      subtitle: "एलेनोर की हवेली आपका इंतजार कर रही है...",
      enterButton: "हवेली के पास जाएं",
    },
    
    nameEntry: {
      title: "हवेली की प्रतिध्वनि",
      subtitle: "भूतिया हवेली इंतजार कर रही है",
      description: "एलेनोर की उदास उपस्थिति हर छाया में बनी रहती है। हवेली में प्रवेश करने का साहस किसमें है?",
      placeholder: "अपना नाम दर्ज करें...",
      submitButton: "हवेली में प्रवेश करें",
      errorEmpty: "कृपया अपना नाम दर्ज करें",
    },
    
    header: {
      title: " हवेली की प्रतिध्वनि ",
      muteMusic: "🔊 संगीत बंद करें",
      unmuteMusic: "🔇 संगीत चालू करें",
      saveLoadButton: "💾 सहेजें/लोड करें",
      languageButton: "🌐 भाषा",
    },
    
    saveMenu: {
      title: "💾 सेव और लोड मेनू",
      generateTitle: "उपकरणों के बीच प्रगति स्थानांतरित करने के लिए एक सेव कोड बनाएं:",
      generateButton: "कोड बनाएं",
      codeLabel: "आपका सेव कोड (कॉपी करने के लिए क्लिक करें):",
      copiedMessage: "क्लिपबोर्ड में कॉपी किया गया!",
      loadTitle: "कोड से गेम लोड करें:",
      loadPlaceholder: "अपना कोड यहाँ पेस्ट करें...",
      loadButton: "गेम लोड करें",
      loadSuccess: "प्रगति सफलतापूर्वक लोड हुई!",
      loadError: "अमान्य कोड। कृपया पुनः प्रयास करें।",
      enterCodeError: "कृपया एक कोड दर्ज करें",
      newGameButton: "🗑️ नया गेम",
      newGameConfirm: "नया गेम शुरू करें? यह आपकी वर्तमान प्रगति को मिटा देगा।",
      newGameSuccess: "प्रगति मिटा दी गई। नई शुरुआत!",
      saveGenerated: "कोड बन गया! किसी भी डिवाइस पर उपयोग करने के लिए इसे कॉपी करें।",
    },
    
    roomPanel: {
      availablePaths: "उपलब्ध रास्ते:",
      goTo: "जाएं",
      movedTo: "आप यहाँ चले गए",
    },
    
    trust: {
      label: "भूत का विश्वास:",
    },
    
    chat: {
      aiCredit: "क्लॉड द्वारा संचालित AI | केविन मैकलियोड द्वारा संगीत",
      you: "आप",
      eleanor: "एलेनोर",
      system: "सिस्टम",
      placeholder: "भूत से बात करें...",
      sendButton: "भेजें",
      summoning: "बुलाया जा रहा है...",
    },
    
    systemMessages: {
      welcome: "हवेली की प्रतिध्वनि में आपका स्वागत है। आप एक उपस्थिति महसूस करते हैं...",
      restored: "पिछली प्रगति बहाल हुई। हवेली की प्रतिध्वनि में वापस स्वागत है...",
      errorConnecting: "भूत से जुड़ने में त्रुटि...",
      error: "त्रुटि:",
    },
    
    rooms: {
      entrance: {
        name: "भव्य प्रवेश कक्ष",
        description: "बाहर गरज गूंजती है जबकि बारिश टूटी सना हुआ कांच की खिड़कियों पर बरसती है। एक भव्य सीढ़ी ऊपर अंधेरे में सर्पिल होती है।",
      },
      library: {
        name: "निषिद्ध पुस्तकालय",
        description: "प्राचीन ग्रंथ ऊंची अलमारियों पर पंक्तिबद्ध हैं, उनके चमड़े के बंधन उम्र से फटे हुए हैं। हवा में सड़न और पुराने रहस्यों की गंध है।",
      },
      dining: {
        name: "शापित भोजन कक्ष",
        description: "बारह भूतिया मेहमानों के लिए तैयार एक लंबी मेज। मकड़ी के जाले कोनों को अंतिम संस्कार के कफन की तरह ढकते हैं।",
      },
      garden: {
        name: "मृत बगीचा",
        description: "मुरझाए गुलाब घने रास्तों को दबा देते हैं। चांद गांठदार पेड़ों के माध्यम से मुड़े हुए छाये डालता है।",
      },
      study: {
        name: "एलेनोर का अध्ययन कक्ष",
        description: "व्यक्तिगत डायरियां एक पुराने डेस्क पर बिखरी हुई हैं। स्याही से सने पत्र एक उदास अतीत के टुकड़े प्रकट करते हैं।",
      },
      kitchen: {
        name: "परित्यक्त रसोई",
        description: "जंग लगे बर्तन एक ठंडे चूल्हे के ऊपर लटकते हैं। पेंट्री के पास फर्श पर कुछ काला धब्बा है।",
      },
    },
  },


 ja: {
    // Japanese
    languageName: "日本語",
    
    welcome: {
      title: "屋敷の残響",
      subtitle: "エレノアの屋敷があなたを待っています...",
      enterButton: "屋敷に近づく",
    },
    
    nameEntry: {
      title: "屋敷の残響",
      subtitle: "幽霊屋敷が待っています",
      description: "エレノアの憂鬱な存在があらゆる影に残っています。屋敷に入る勇気があるのは誰ですか？",
      placeholder: "名前を入力...",
      submitButton: "屋敷に入る",
      errorEmpty: "名前を入力してください",
    },
    
    header: {
      title: " 屋敷の残響 ",
      muteMusic: "🔊 音楽をミュート",
      unmuteMusic: "🔇 音楽をオン",
      saveLoadButton: "💾 セーブ/ロード",
      languageButton: "🌐 言語",
    },
    
    saveMenu: {
      title: "💾 セーブ＆ロードメニュー",
      generateTitle: "デバイス間で進行状況を転送するためのセーブコードを生成：",
      generateButton: "コードを生成",
      codeLabel: "セーブコード（クリックしてコピー）：",
      copiedMessage: "クリップボードにコピーしました！",
      loadTitle: "コードからゲームをロード：",
      loadPlaceholder: "コードをここに貼り付け...",
      loadButton: "ゲームをロード",
      loadSuccess: "進行状況が正常にロードされました！",
      loadError: "無効なコード。もう一度お試しください。",
      enterCodeError: "コードを入力してください",
      newGameButton: "🗑️ 新しいゲーム",
      newGameConfirm: "新しいゲームを始めますか？現在の進行状況がクリアされます。",
      newGameSuccess: "進行状況がクリアされました。最初から始めます！",
      saveGenerated: "コードが生成されました！どのデバイスでも使用できるようにコピーしてください。",
    },
    
    roomPanel: {
      availablePaths: "利用可能な道：",
      goTo: "行く",
      movedTo: "あなたは移動しました",
    },
    
    trust: {
      label: "幽霊の信頼：",
    },
    
    chat: {
      aiCredit: "ClaudeによるAI | Kevin MacLeodによる音楽",
      you: "あなた",
      eleanor: "エレノア",
      system: "システム",
      placeholder: "幽霊に話しかける...",
      sendButton: "送信",
      summoning: "召喚中...",
    },
    
    systemMessages: {
      welcome: "屋敷の残響へようこそ。あなたは存在を感じます...",
      restored: "以前の進行状況が復元されました。屋敷の残響へお帰りなさい...",
      errorConnecting: "幽霊との接続エラー...",
      error: "エラー：",
    },
    
    rooms: {
      entrance: {
        name: "大玄関ホール",
        description: "雷が外で鳴り響き、雨がひび割れたステンドグラスの窓に打ちつけます。大階段が上の暗闇へと螺旋を描いています。",
      },
      library: {
        name: "禁断の図書館",
        description: "古代の書物が高い棚に並び、革の装丁は年月で割れています。空気は腐敗と古い秘密の匂いがします。",
      },
      dining: {
        name: "呪われた食堂",
        description: "十二人の幽霊客のために用意された長いテーブル。蜘蛛の巣が葬儀の覆いのように隅を覆っています。",
      },
      garden: {
        name: "死の庭園",
        description: "枯れたバラが生い茂った小道を窒息させています。月が節くれだった木々を通して歪んだ影を投げかけています。",
      },
      study: {
        name: "エレノアの書斎",
        description: "古い机の上に個人的な日記が散らばっています。インクで染まった手紙が憂鬱な過去の断片を明らかにしています。",
      },
      kitchen: {
        name: "放棄された台所",
        description: "錆びた鍋が冷たいコンロの上にぶら下がっています。食料庫の近くの床に何か暗いものが染みています。",
      },
    },
  },
}


// Helper function to get nested translation
export const getTranslation = (lang, path) => {
  const keys = path.split('.');
  let value = translations[lang];
  
  for (const key of keys) {
    if (value && value[key] !== undefined) {
      value = value[key];
    } else {
      // Fallback to English if translation not found
      value = translations.en;
      for (const k of keys) {
        value = value[k];
      }
      break;
    }
  }
  
  return value;
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];