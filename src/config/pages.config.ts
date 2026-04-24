import { IMenuItem } from "@/shared/types/menu";

export const MAIN_MENU: IMenuItem[] = [
    {
        title: "Play",
        link: "/matchmaking",
        icon: "play",
    },
    {
        title: "Rank",
        link: "/rank",
        icon: "rank",
    },
    {
        title: "Track",
        link: "/track/[userID]",
        icon: "track",
        dynamic: true,
    },
    {
        title: "Watch",
        link: "/watch",
        icon: "watch",
    },
    {
        title: "News",
        link: "/news",
        icon: "news",
    }
]


export const CLUBS_MENU: IMenuItem[] = [
    {
        title: "Clubs",
        link: "/clubs",
        icon: "clubs",
    },
    {
        title: "Create club",
        link: "/create-club",
        icon: "createClub",
    }
]

export const POINTS_MENU: IMenuItem[] = [
    {
        title: "Missions",
        link: "/missions",
        icon: "missions",
    }
]