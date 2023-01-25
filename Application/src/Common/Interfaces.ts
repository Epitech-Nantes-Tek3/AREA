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