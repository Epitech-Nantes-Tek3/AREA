export let ACTIONS = [
    {
        service: {
            name: "twitch",
            needsConnexion: true
        },
        description: "Quand Kaméto est en live"
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
    }
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
        description: "Jouer du Daft Punk"
    }
]