import { Badge, BadgePlus, Bell, BookText, ChartLine, ChartNoAxesColumn, CircleStar, Gift, Info, Play, Scan, Settings, Swords, Users, Video } from "lucide-react";

export const ICONS = {
    play: Play,
    rank: ChartNoAxesColumn,
    track: ChartLine,
    watch: Video,
    news: BookText,
    clubs: Badge,
    createClub: BadgePlus,
    missions: Scan,
    matches: Swords,
    notifications: Bell,
    friends: Users,
    settings: Settings,
    rewards: Gift,
    subscriptions: CircleStar,
    support: Info,
} as const;