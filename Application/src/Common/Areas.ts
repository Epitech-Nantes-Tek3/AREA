import { InfoArea } from "./Interfaces"

export let ACTIONS: InfoArea[] = [
    {
        serviceName: "iss",
        trigger: true,
        description: "Quand l'ISS passe au dessus de chez moi",
        text: undefined,
        subject: undefined
    },
    {
        serviceName: "météo",
        trigger: true,
        description: "Quand il fait beau chez moi",
        text: undefined,
        subject: undefined
    },
    {
        serviceName : "spotify action",
        trigger: true,
        description: "Si l'utilisateur suit un artiste sélectionné",
        text: undefined,
        subject : undefined
    },
    {
        serviceName : "spotify action",
        trigger: true,
        description: "Si l'utilisateur écoute de la musique",
        text: undefined,
        subject : undefined
    },
    {
        serviceName : "spotify action",
        trigger: true,
        description: "Si l'utilisateur écoute une musique spécifique",
        text: undefined,
        subject : undefined
    },
    {
        serviceName : "twitch",
        trigger: true,
        description: "Si Rocket League est le jeu le plus regardé sur Twitch",
        text: "Rocket League",
        subject : "game"
    },
    {
        serviceName : "twitch",
        trigger: true,
        description: "Si Counter-Strike: Global Offensive est le jeu le plus regardé sur Twitch",
        text: "Counter-Strike: Global Offensive",
        subject : "game"
    },
    {
        serviceName : "twitch",
        trigger: true,
        description: "Si Just Chatting est la catégorie la plus regardée sur Twitch",
        text: "Just Chatting",
        subject : "game"
    },
    {
        serviceName : "twitch",
        trigger: true,
        description: "Si krl_stream est en live",
        text: "krl_stream",
        subject : "stream"
    },
    {
        serviceName : "twitch",
        trigger: true,
        description: "Si manuellferraraTV est en live",
        text: "manuellferraraTV",
        subject : "stream"
    },
    {
        serviceName : "twitch",
        trigger: true,
        description: "Si amouranth est en live",
        text: "amouranth",
        subject : "stream"
    },
    {
        serviceName : "twitch",
        trigger: true,
        description: "Si amouranth à plus de 10000 viewers",
        text: "amouranth__10000",
        subject : "viewers"
    },
    {
        serviceName : "twitch",
        trigger: true,
        description: "Si gotaga à plus de 20000 viewers",
        text: "gotaga_20000",
        subject : "viewers"
    },
    {
        serviceName : "twitch",
        trigger: true,
        description: "Si krl à plus de 1000 viewers",
        text: "krl_stream__1000",
        subject : "viewers"
    }
]

export let REACTIONS: InfoArea[] = [
    {
        serviceName: "twitter",
        trigger: undefined,
        description: "Retweet Elon Musk",
        text: "ElonMusk",
        subject: "retweet"
    },
    {
        serviceName: "twitter",
        trigger: undefined,
        description: "Liker le dernier tweet sur Elon Musk",
        text: "ElonMusk",
        subject: "like"
    },
    {
        serviceName: "twitter",
        trigger: undefined,
        description: "Poster un tweet",
        text: "Yo Elon",
        subject: "tweet"
    },
    {
        serviceName: "google",
        trigger: undefined,
        description: "M'envoyer un mail avec les infos",
        text: "Pense au rendez-vous du 09/02",
        subject: "Area Info"
    },
    {
        serviceName: "spotify reaction",
        trigger: undefined,
        description: 'Pause la musique en cours',
        text: undefined,
        subject: undefined,
    },
    {
        serviceName: "spotify reaction",
        trigger: undefined,
        description: 'Met en aléatoire la file d\'attente de l\'utilisateur',
        text: undefined,
        subject: undefined,
    },
    {
        serviceName: "spotify reaction",
        trigger: undefined,
        description: 'Crée une playlist',
        text: 'NomDeLaPlaylist',
        subject: 'playlist creation',
    },

]