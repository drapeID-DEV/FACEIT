export interface ILoginReq {
	email: string;
	password: string;
	code?: string;
}

export interface IRegisterReq {
	nickname: string;
	email: string;
	password: string;
	passwordRepeat: string;
}
