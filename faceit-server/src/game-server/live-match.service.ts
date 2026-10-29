import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { PrismaService } from '@/prisma/prisma.service'

import { LogEvent, LogPlayer, Side, parseLogLine } from './log-parser'

interface LivePlayer {
	userId: string
	team: number
	side: Side | null
	kills: number
	deaths: number
	assists: number
	headshots: number
}

interface LiveMatchState {
	matchId: string
	isLive: boolean
	isOver: boolean
	team1Score: number
	team2Score: number
	// keyed by SteamID64
	players: Map<string, LivePlayer>
}

export interface LiveMatchSnapshot {
	matchId: string
	isLive: boolean
	round: number
	team1Score: number
	team2Score: number
	players: {
		userId: string
		team: number
		side: Side | null
		kills: number
		deaths: number
		assists: number
		headshots: number
	}[]
}

export interface MatchGameOverPayload {
	matchId: string
	winnerTeam: 1 | 2
	team1Score: number
	team2Score: number
	playerStats: {
		userId: string
		kills: number
		deaths: number
		assists: number
		headshots: number
		mvpRounds: number
	}[]
}

@Injectable()
export class LiveMatchService {
	private readonly logger = new Logger(LiveMatchService.name)
	private readonly states = new Map<string, LiveMatchState>()
	// Log batches for one match are applied strictly in order
	private readonly queues = new Map<string, Promise<void>>()

	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventEmitter: EventEmitter2
	) {}

	handleLog(matchId: string, body: string) {
		const events = body
			.split(/\r?\n/)
			.map(line => parseLogLine(line))
			.filter((event): event is LogEvent => event !== null)

		if (!events.length) {
			return
		}

		const previous = this.queues.get(matchId) ?? Promise.resolve()
		const next = previous
			.then(() => this.apply(matchId, events))
			.catch(error =>
				this.logger.error(
					`Failed to apply log for match ${matchId}: ${(error as Error).message}`
				)
			)

		this.queues.set(matchId, next)
	}

	getSnapshot(matchId: string): LiveMatchSnapshot | null {
		const state = this.states.get(matchId)
		return state ? this.toSnapshot(state) : null
	}

	clear(matchId: string) {
		this.states.delete(matchId)
		this.queues.delete(matchId)
	}

	private async loadState(matchId: string): Promise<LiveMatchState | null> {
		const existing = this.states.get(matchId)
		if (existing) {
			return existing
		}

		const match = await this.prismaService.match.findUnique({
			where: { id: matchId },
			include: {
				participants: { include: { user: { select: { steamId: true } } } }
			}
		})

		if (!match || match.status !== 'LIVE') {
			this.logger.warn(`Ignoring log for match ${matchId}: not live`)
			return null
		}

		const players = new Map<string, LivePlayer>()

		for (const participant of match.participants) {
			if (!participant.user.steamId) {
				this.logger.warn(
					`Participant ${participant.userId} has no Steam ID, their stats will not be tracked`
				)
				continue
			}

			players.set(participant.user.steamId, {
				userId: participant.userId,
				team: participant.team,
				side: null,
				kills: participant.kills,
				deaths: participant.deaths,
				assists: participant.assists,
				headshots: participant.headshots
			})
		}

		const state: LiveMatchState = {
			matchId,
			isLive: false,
			isOver: false,
			team1Score: match.team1Score,
			team2Score: match.team2Score,
			players
		}

		this.states.set(matchId, state)

		return state
	}

	private async apply(matchId: string, events: LogEvent[]) {
		const state = await this.loadState(matchId)

		if (!state || state.isOver) {
			return
		}

		for (const event of events) {
			this.trackSides(state, event)

			switch (event.type) {
				case 'matchStart':
					this.resetStats(state)
					break
				case 'kill':
					this.applyKill(state, event)
					break
				case 'assist': {
					const assister = this.find(state, event.assister)
					if (assister && event.assister.side !== event.victim.side) {
						assister.assists++
					}
					break
				}
				case 'suicide': {
					const player = this.find(state, event.player)
					if (player) player.deaths++
					break
				}
				case 'teamScore':
					this.applyTeamScore(state, event.side, event.score)
					break
				case 'roundEnd':
					await this.persist(state)
					break
				case 'gameOver':
					await this.finish(state)
					break
			}

			if (state.isOver) {
				break
			}
		}

		this.eventEmitter.emit('match.liveStats', this.toSnapshot(state))
	}

	private find(state: LiveMatchState, player: LogPlayer) {
		return player.steamId ? state.players.get(player.steamId) : undefined
	}

	private trackSides(state: LiveMatchState, event: LogEvent) {
		const logPlayers: LogPlayer[] =
			event.type === 'kill'
				? [event.attacker, event.victim]
				: event.type === 'assist'
					? [event.assister, event.victim]
					: event.type === 'suicide' || event.type === 'switchTeam'
						? [event.player]
						: []

		for (const logPlayer of logPlayers) {
			const player = this.find(state, logPlayer)
			if (player && logPlayer.side) {
				player.side = logPlayer.side
			}
		}
	}

	private resetStats(state: LiveMatchState) {
		state.isLive = true
		state.team1Score = 0
		state.team2Score = 0

		for (const player of state.players.values()) {
			player.kills = 0
			player.deaths = 0
			player.assists = 0
			player.headshots = 0
		}
	}

	private applyKill(
		state: LiveMatchState,
		event: Extract<LogEvent, { type: 'kill' }>
	) {
		const attacker = this.find(state, event.attacker)
		const victim = this.find(state, event.victim)

		if (victim) {
			victim.deaths++
		}

		// No credit for team kills
		if (attacker && event.attacker.side !== event.victim.side) {
			attacker.kills++
			if (event.headshot) attacker.headshots++
		}
	}

	private applyTeamScore(state: LiveMatchState, side: Side, score: number) {
		const players = [...state.players.values()]

		// Sides swap at halftime, so resolve the team from who is on that side right now
		let team = players.find(player => player.side === side)?.team

		if (!team) {
			const otherTeam = players.find(
				player => player.side && player.side !== side
			)?.team
			team = otherTeam ? (otherTeam === 1 ? 2 : 1) : undefined
		}

		if (team === 1) state.team1Score = score
		if (team === 2) state.team2Score = score
	}

	private async persist(state: LiveMatchState) {
		await this.prismaService.$transaction([
			this.prismaService.match.update({
				where: { id: state.matchId },
				data: {
					team1Score: state.team1Score,
					team2Score: state.team2Score
				}
			}),
			...[...state.players.values()].map(player =>
				this.prismaService.matchParticipant.updateMany({
					where: { matchId: state.matchId, userId: player.userId },
					data: {
						kills: player.kills,
						deaths: player.deaths,
						assists: player.assists,
						headshots: player.headshots
					}
				})
			)
		])
	}

	private async finish(state: LiveMatchState) {
		state.isOver = true

		await this.persist(state)

		if (state.team1Score === state.team2Score) {
			this.logger.warn(
				`Match ${state.matchId} ended in a draw, finish it manually`
			)
			return
		}

		const participants = await this.prismaService.matchParticipant.findMany({
			where: { matchId: state.matchId }
		})

		const payload: MatchGameOverPayload = {
			matchId: state.matchId,
			winnerTeam: state.team1Score > state.team2Score ? 1 : 2,
			team1Score: state.team1Score,
			team2Score: state.team2Score,
			playerStats: participants.map(participant => ({
				userId: participant.userId,
				kills: participant.kills,
				deaths: participant.deaths,
				assists: participant.assists,
				headshots: participant.headshots,
				mvpRounds: participant.mvpRounds
			}))
		}

		this.eventEmitter.emit('match.gameOver', payload)
	}

	private toSnapshot(state: LiveMatchState): LiveMatchSnapshot {
		return {
			matchId: state.matchId,
			isLive: state.isLive && !state.isOver,
			round: state.team1Score + state.team2Score + (state.isOver ? 0 : 1),
			team1Score: state.team1Score,
			team2Score: state.team2Score,
			players: [...state.players.values()].map(player => ({ ...player }))
		}
	}
}
