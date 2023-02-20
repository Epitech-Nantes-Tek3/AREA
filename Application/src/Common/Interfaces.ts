import { Dispatch } from "react"

export interface SingleArea {
    action: InfoArea
    reaction: InfoArea
    id: string
}

export const Streamers = [
    "amouranth",
    "brucegrannec",
    "domingo",
    "krl_stream",
    "manuellferraraTV",
    "pekeasmr",
    "terasgul",
]

export const Games = [
    "CS-GO",
    "Hogwarts Legacy",
    "League of Legends",
    "Minecraft",
    "Rocket League",
]

export const Artists = [
    "an'om",
    "avicii",
    "bilal hassani",
    "jul",
    "sebastien patoche",
    "theo lavabo"
]

export const Songs = [
    "Ambiance à l'africaine, Magic System",
    "As it was, Harry Styles",
    "Butterfly & Hurricanes, Muse",
    "Let you down, NF",
    "Logobitombo, Moussier Tombola"
]

export const Hashtags = [
    "cgt",
    "elonmusk",
    "hashtag",
    "lgbtq",
    "psg",
    "ratio"
]

export const Cities = [
    "Ma position",
    "Anus",
    "Colmar",
    "Faucon",
    "Moncuq",
    "Nantes",
    "Paris",
    "Poil",
    "Strasbourg",
    "Tourcoing",
]

export const Gap = [
    "5000",
    "10000",
    "15000",
    "20000",
]

export const Viewers = [
    "1",
    "1000",
    "10000",
    "50000",
]

export interface AreaList {
    list: Array<SingleArea>
}

export interface InfoArea {
    serviceName: "spotify" | "google" | "twitter" | "twitch" | "iss" | "météo" | "nasa" | "strava"
    description: string
    option: "Topic" | "Song" | "Artist" | "City" | "Games" | "Streamer" | "Gap" | "Viewers" | undefined
    text: boolean
    trigger: boolean
}

export interface HomeScreenProps {
    userMail: string
    userId: string
    ip: string
}

export interface SettingsProps {
    userInfo: UserInfo
    setUserInfo: Dispatch<React.SetStateAction<UserInfo>>
    hasAuthorization: boolean
}

interface Location {
    latitude: number
    longitude: number
    city: string
}

interface ServicesInfo {
    spotifyId: string
    googleId: string
    twitterId: string
    twitchId: string
    stravaId: string
}

export interface UserInfo {
    mail: string
    coord: Location
    id: string
    services: ServicesInfo
    ip: string
}

export interface AddAreaProps {
    allAreas: Array<SingleArea>
    setAllAreas: Dispatch<React.SetStateAction<Array<SingleArea>>>
    userInfo: UserInfo
    setUserInfo: Dispatch<React.SetStateAction<UserInfo>>
}    