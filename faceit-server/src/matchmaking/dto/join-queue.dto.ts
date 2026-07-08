import { IsEnum } from 'class-validator'

import { MatchType } from '../../../generated/prisma'

export class JoinQueueDto {
	@IsEnum(MatchType)
	matchType: MatchType
}
