export interface IOAuthUser {
	provider: string
	providerId: string
	email: string
	name: string
	picture?: string
	accessToken: string
	refreshToken?: string
}
