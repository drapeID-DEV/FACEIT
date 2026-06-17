import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import { PrismaClient } from '../../generated/prisma'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor(config: ConfigService) {
		const pool = new Pool({ connectionString: config.get('POSTGRES_URI') })
		const adapter = new PrismaPg(pool)
		super({ adapter })
	}

	public async onModuleInit() {
		await this.$connect()
	}

	public async onModuleDestroy() {
		await this.$disconnect()
	}
}
