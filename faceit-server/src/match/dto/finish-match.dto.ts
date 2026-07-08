import { Type } from 'class-transformer'
import {
	IsArray,
	IsInt,
	IsString,
	Max,
	Min,
	ValidateNested
} from 'class-validator'

export class PlayerStatsDto {
	@IsString()
	userId: string

	@IsInt()
	@Min(0)
	kills: number

	@IsInt()
	@Min(0)
	deaths: number

	@IsInt()
	@Min(0)
	assists: number

	@IsInt()
	@Min(0)
	headshots: number

	@IsInt()
	@Min(0)
	mvpRounds: number
}

export class FinishMatchDto {
	@IsInt()
	@Min(1)
	@Max(2)
	winnerTeam: number

	@IsInt()
	@Min(0)
	team1Score: number

	@IsInt()
	@Min(0)
	team2Score: number

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PlayerStatsDto)
	playerStats: PlayerStatsDto[]
}
