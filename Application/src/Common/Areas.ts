import { InfoArea } from "./Interfaces"

export let ACTIONS: InfoArea[] = [
    {
        service: "twitch",
        description: "Quand Kaméto est en live"
    },
    {
        service: "nasa",
        description: "Quand l'ISS passe au dessus de chez moi"
    },
    {
        service: "météo",
        description: "Quand il pleut chez moi"
    }
]

export let REACTIONS: InfoArea[] = [
    {
        service: "twitter",
        description: "Retweet Elon Musk"
    },
    {
        service: "google",
        description: "M'envoyer un mail avec les infos"
    },
    {
        service: "spotify",
        description: "Jouer du Daft Punk"
    }
]