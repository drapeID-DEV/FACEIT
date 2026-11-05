import { Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { NotificationService } from './notification.service'

@Controller('notifications')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get()
	async findAll(@Authorized('id') userId: string) {
		return this.notificationService.findAll(userId)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch('read-all')
	async markAllAsRead(@Authorized('id') userId: string) {
		return this.notificationService.markAllAsRead(userId)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch(':id/read')
	async markAsRead(@Authorized('id') userId: string, @Param('id') id: string) {
		return this.notificationService.markAsRead(userId, id)
	}
}
