export interface SingleArea {
    action: InfoArea
    reaction: InfoArea
}

export interface AreaList {
    list: Array<SingleArea>
}

export interface InfoArea {
    service: Service
    description: string
}

export interface Service {
    name: "spotify" | "google" | "twitter" | "twitch" | "iss" | "météo" | "nasa" | "strava"
    needsConnexion: boolean
}

export interface HomeScreenProps {
    userMail: string
}

interface Location {
    latitude: number
    longitude: number
    city: string
}

export interface UserInfo {
    mail: string
    coord: Location
}