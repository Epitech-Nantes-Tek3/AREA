import { InfoArea } from "./Interfaces"

export let ACTIONS: InfoArea[] = [
    {
        serviceName: "twitch",
        trigger: true,
        description: "Quand Kaméto est en live"
    },
    {
        serviceName: "iss",
        trigger: true,
        description: "Quand l'ISS passe au dessus de chez moi"
    },
    {
        serviceName: "météo",
        trigger: true,
        description: "Quand il pleut chez moi"
    }
]

export let REACTIONS: InfoArea[] = [
    {
        serviceName: "twitter",
        trigger: false,
        description: "Retweet Elon Musk"
    },
    {
        serviceName: "google",
        trigger: false,
        description: "M'envoyer un mail avec les infos"
    },
    {
        serviceName: "spotify",
        trigger: false,
        description: "Jouer du Daft Punk"
    }
]