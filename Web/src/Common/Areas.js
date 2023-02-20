export let ACTIONS = [
    {
        service: {
            name: "twitch",
            needsConnexion: true
        },
        description: "Quand {config} est en live",
        config: [
            "terasgul",
            "krl_stream",
            "domingo",
            "manuellferraraTV",
            "amouranth",
            "pekeasmr",
            "brucegrannec"
        ]
    },
    {
        service: {
            name: "iss",
            needsConnexion: false
        },
        description: "Quand l'ISS passe au \n dessus de chez moi"
    },
    {
        service: {
            name: "météo",
            needsConnexion: false
        },
        description: "Quand il pleut chez moi"
    },
    {
        service: {
            name: "spotify",
            needsConnexion: true
        },
        description: "Si l'utilisateur suit {config}",
        config: [
            "jul",
            "avicii",
            "an'om",
            "sebastien patoche",
            "bilal hassani",
            "theo lavabo"
        ]
    },
    {
        service: {
            name: "spotify",
            needsConnexion: true
        },
        description: "Si l'utilisateur écoute de la musique"
    },
    {
        service: {
            name: "spotify",
            needsConnexion: true
        },
        description: "Si l'utilisateur écoute {config}",
        config: [
            "let you down",
            "as it was",
            "ambiance à l'africaine",
            "butterflies and haurricanes",
            "logobitombo"
        ]
    },
]

export let REACTIONS = [
    {
        service: {
            name: "twitter",
            needsConnexion: true
        },
        description: "Retweet Elon Musk"
    },
    {
        service: {
            name: "google",
            needsConnexion: true
        },
        description: "M'envoyer un mail avec les infos"
    },
    {
        service: {
            name: "spotify",
            needsConnexion: true
        },
        description: "Pause la musique en cours"
    },
    {
        service: {
            name: "spotify",
            needsConnexion: true
        },
        description: "Met en aléatoire la file d\'attente"
    },
    {
        service: {
            name: "spotify",
            needsConnexion: true
        },
        description: "Crée une playlist"
    }
]