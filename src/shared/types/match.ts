import { UserID } from "./user";

export type MatchID = string;

export interface IMatch {
    id: MatchID,
    teams: {
        team1: UserID[],
        team2: UserID[],
    },
    result: "Win" | "Lose",
}