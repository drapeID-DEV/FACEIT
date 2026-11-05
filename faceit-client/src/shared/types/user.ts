export interface IUser {
	user: Pick<IUserData, 'id' | 'email' | 'nickname' | 'role'>;
}

export interface IUserData {
	id: string;
	email: string;
	nickname: string;
	steamId: string | null;
	elo: number;
	profilePic: string;
	role: string;
	isBanned: boolean;
	isVerified: boolean;
	isTwoFactorEnabled: boolean;
	method: string;
	createdAt: string;
	updatedAt: string;
}
