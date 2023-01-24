export interface SingleArea {
    action: InfoArea
    reaction: InfoArea
}

export interface AreaList {
    list: Array<SingleArea>
}

export interface InfoArea {
    service: "spotify" | "google" | "twitter" | "twitch" | "iss" | "météo" | "nasa"
    description: string
}