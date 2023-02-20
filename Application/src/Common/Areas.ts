import { InfoArea } from "./Interfaces"

export let ACTIONS: InfoArea[] = [
    {
        serviceName: "iss",
        trigger: true,
        description: "Quand l'ISS passe à moins de ??? km de chez moi",
        option: "Gap",
        text: false,
    },
    {
        serviceName: "météo",
        trigger: true,
        description: "Quand il fait beau à ???",
        text: false,
        option: "City",
    },
    {
        serviceName : "spotify",
        trigger: true,
        description: "Si l'utilisateur suit ???",
        text: false,
        option: "Artist",
    },
    {
        serviceName : "spotify",
        trigger: true,
        description: "Si l'utilisateur écoute de la musique",
        text: false,
        option: undefined,
    },
    {
        serviceName : "spotify",
        trigger: true,
        description: "Si l'utilisateur écoute ???",
        text: false,
        option: "Song",
    },
]

export let REACTIONS: InfoArea[] = [
    {
        serviceName: "twitter",
        trigger: false,
        description: "Retweet ???",
        text: false,
        option: "Topic",
    },
    {
        serviceName: "twitter",
        trigger: false,
        description: "Liker le dernier tweet sur ???",
        text: false,
        option: "Topic",
    },
    {
        serviceName: "twitter",
        trigger: false,
        description: "Poster un tweet",
        text: true,
        option: undefined,
    },
    {
        serviceName: "google",
        trigger: false,
        description: "M'envoyer un mail",
        text: true,
        option: undefined,
    },
    {
        serviceName: "google",
        trigger: false,
        description: "Envoyer un mail à ???",
        text: true,
        option: undefined,
    },
    {
        serviceName: "spotify",
        trigger: false,
        description: 'Pause la musique en cours',
        text: false,
        option: undefined,
    },
    {
        serviceName: "spotify",
        trigger: false,
        description: "Met en aléatoire la file d'attente de l'utilisateur",
        text: false,
        option: undefined,
    },

]