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
        serviceName : "spotify",
        trigger: true,
        description: "Si l'utilisateur suit un artiste sélectionné",
        text: undefined,
        subject : undefined
    },
    {
        serviceName : "spotify",
        trigger: true,
        description: "Si l'utilisateur écoute de la musique",
        text: undefined,
        subject : undefined
    },
    {
        serviceName : "spotify",
        trigger: true,
        description: "Si l'utilisateur écoute une musique spécifique",
        text: undefined,
        subject : undefined
    },
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
        serviceName: "spotify",
        trigger: undefined,
        description: 'Pause la musique en cours',
        text: undefined,
        subject: undefined,
    },
    {
        serviceName: "spotify",
        trigger: undefined,
        description: 'Met en aléatoire la file d\'attente de l\'utilisateur',
        text: undefined,
        subject: undefined,
    },
    {
        serviceName: "spotify",
        trigger: undefined,
        description: 'Crée une playlist',
        text: 'NomDeLaPlaylist',
        subject: 'playlist creation',
    },

]