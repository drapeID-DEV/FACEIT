import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

import { UserService } from '@/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(
		private readonly userService: UserService,
		private readonly config: ConfigService
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const response = context.switchToHttp().getResponse()

		if (typeof request.session.userId === 'undefined') {
			response.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))

			throw new UnauthorizedException(
				'User is not authenticated. Please sign in to access this resource.'
			)
		}

		const user = await this.userService.findById(request.session.userId)

		request.user = user

		return true
	}
}
