export interface IAccount {
	id: string;
	type: string;
	provider: string;
	refreshToken: string;
	accessToken: string;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
	user: IUser;
	userId: string;
}

export interface IUser {
	user: IUserData;
}

export interface IUserData {
	id: string;
	email: string;
	password: string;
	nickname: string;
	elo: number;
	profilePic: string;
	role: string;
	isVerified: boolean;
	isTwoFactorEnabled: boolean;
	method: string;
	createdAt: string;
	updatedAt: string;
	accounts: IAccount[];
}

export interface IPlayerStats {
	id: string;
	userId: string;
	totalMatches: number;
	totalWins: number;
	totalLosses: number;
	totalKills: number;
	totalDeaths: number;
	totalAssists: number;
	totalHeadshots: number;
	totalMvpRounds: number;
	updatedAt: string;
}
