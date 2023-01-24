interface IScreen {
    name: string
}

interface ScreensContainer {
    ConnexionScreen: IScreen
    SubscribeScreen: IScreen
}

interface ColorsContainer {
    main: string
    dark: string
    lightBackground: string
}

interface IGlobals {
    Screens: ScreensContainer,
    Colors: ColorsContainer
}

export const Globals: IGlobals = {
    Screens: {
        ConnexionScreen: {
            name: "ConnexionScreen",
        },
        SubscribeScreen: {
            name: "SubscribeScreen",
        },
    },
    Colors: {
        main: "#95B8D1",
        dark: "#392D37",
        lightBackground: "#FEF3EB",
    }
}