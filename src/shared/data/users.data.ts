import { IUser } from "../types/user";

export const USERS: Record<string, IUser> = {
    u1: {
        id: "u1",
        username: "drape",
        avatarURL: "https://i.pinimg.com/474x/9d/e5/d2/9de5d2ab40011b354914c778341e3bff.jpg",
        elo: 1200,
        friends: ["u6", "u2", "u3", "u4", "u5", "u7"],
        matchIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "10", "11", "10", "11"]
    },
    u2: {
        id: "u2",
        username: "shuma",
        avatarURL: "/avatars/u2.png",
        elo: 1250,
        friends: ["u1", "u6", "u3", "u4", "u5"],
        matchIds: ["1"]
    },
    u3: {
        id: "u3",
        username: "Aksin3d",
        avatarURL: "/avatars/u3.png",
        elo: 1300,
        friends: ["u1", "u2", "u6", "u4", "u5"],
        matchIds: ["1"]
    },
    u4: {
        id: "u4",
        username: "мама макса",
        avatarURL: "/avatars/u4.png",
        elo: 1100,
        friends: [],
        matchIds: ["1"]
    },
    u5: {
        id: "u5",
        username: "rezer",
        avatarURL: "/avatars/u5.png",
        elo: 3000,
        friends: [],
        matchIds: ["1"]
    },
    u6: {
        id: "u6",
        username: "Spov",
        avatarURL: "/avatars/u6.png",
        elo: 1350,
        friends: [],
        matchIds: ["1"]
    },
    u7: {
        id: "u7",
        username: "сестра макса",
        avatarURL: "/avatars/u7.png",
        elo: 1280,
        friends: [],
        matchIds: ["1"]
    },
    u8: {
        id: "u8",
        username: "Player8",
        avatarURL: "/avatars/u8.png",
        elo: 1500,
        friends: [],
        matchIds: ["1"]
    },
    u9: {
        id: "u9",
        username: "Player9",
        avatarURL: "/avatars/u9.png",
        elo: 1180,
        friends: [],
        matchIds: ["1"]
    },
    u10: {
        id: "u10",
        username: "Player10",
        avatarURL: "/avatars/u10.png",
        elo: 1600,
        friends: [],
        matchIds: ["1"]
    }
};