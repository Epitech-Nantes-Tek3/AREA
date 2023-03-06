import { Dispatch } from "react"

export interface SingleArea {
    action: InfoArea
    reaction: InfoArea
    id: string
}

export interface AreaList {
    list: Array<SingleArea>
}

export interface InfoArea {
    serviceName:  "spotify"| "google" | "twitter" | "twitch" | "iss" | "météo" | "nasa" | "strava"
    description: string
    text: string | Array<string> | undefined
    trigger: boolean | undefined
    subject: string | undefined
}

export interface HomeScreenProps {
    userMail: string | null
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
    mail: string | null
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