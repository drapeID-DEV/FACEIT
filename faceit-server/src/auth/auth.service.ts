import { Injectable } from '@nestjs/common'

import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
	public async register(dto: RegisterDto) {}

	public async login() {}

	public async logout() {}

	private async saveSession() {}
}
