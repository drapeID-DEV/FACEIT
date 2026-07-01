export interface IOAuthUser {
	provider: string
	providerId: string
	email: string
	displayName: string
	picture?: string
	accessToken: string
	refreshToken?: string
}
