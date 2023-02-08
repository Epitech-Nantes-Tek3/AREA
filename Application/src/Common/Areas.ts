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
    }
]