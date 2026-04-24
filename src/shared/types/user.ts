import { MatchID } from "./match";

export type UserID = string;

export interface IUser {
    id: UserID,
    username: string,
    avatarURL: string,
    elo: number,
    friends: UserID[],
    matchIds: MatchID[],
}