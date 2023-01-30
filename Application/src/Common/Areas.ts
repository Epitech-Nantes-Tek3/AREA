import { InfoArea, Service } from "./Interfaces"

export let ACTIONS: InfoArea[] = [
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
        description: "Quand l'ISS passe au dessus de chez moi"
    },
    {
        service: {
            name: "météo",
            needsConnexion: false
        },
        description: "Quand il pleut chez moi"
    }
]

export let REACTIONS: InfoArea[] = [
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

export let SERVICES: Array<Service> = [
    {
        name: "google",
        needsConnexion: true
    },
    {
        name: "spotify",
        needsConnexion: true
    },
    {
        name: "iss",
        needsConnexion: false
    },
    {
        name: "météo",
        needsConnexion: false
    },
    {
        name: "nasa",
        needsConnexion: false
    },
    {
        name: "google",
        needsConnexion: true
    },
    {
        name: "strava",
        needsConnexion: true
    },
    {
        name: "twitter",
        needsConnexion: true
    },
    {
        name: "twitch",
        needsConnexion: true
    },
]