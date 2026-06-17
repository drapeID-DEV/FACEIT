export interface IAuthRes {
	message: string;
	tokenType: string;
	accessToken: string;
	expiresInSeconds: number;
	user: {
		id: number;
		nickname: string;
		role: string;
	};
}

export interface IUserRes {
	id: number;
	nickname: string;
	role: string;
}

export interface ILogoutRes {
	message: string;
}

export interface IErrorRes {
	error: string;
	code: string;
	timestamp: string;
	requestId: string;
	path: string;
}

export interface IRefreshRes {
	message: string;
	tokenType: string;
	expiresInSeconds: number;
}
