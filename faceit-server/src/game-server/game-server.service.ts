import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ChildProcess, spawn } from 'node:child_process'
import { createSocket } from 'node:dgram'
import { writeFileSync } from 'node:fs'
import { networkInterfaces } from 'node:os'
import { join, resolve } from 'node:path'

import { LiveMatchService } from './live-match.service'

const ALLOWED_MAPS = new Set([
	'de_mirage',
	'de_inferno',
	'de_nuke',
	'de_train',
	'de_dust2',
	'de_ancient',
	'de_anubis'
])

// A2S_INFO query, any reply (info or challenge) means the server is up
const A2S_INFO_REQUEST = Buffer.concat([
	Buffer.from([0xff, 0xff, 0xff, 0xff, 0x54]),
	Buffer.from('Source Engine Query\0', 'ascii')
])

const READY_POLL_INTERVAL = 2_000
const READY_TIMEOUT = 180_000

// Virtual adapters (Docker, WSL, Hyper-V, VPNs) that are not reachable from LAN
const IGNORED_INTERFACES = /vethernet|wsl|docker|virtualbox|vmware|hyper-v|loopback|tailscale|zerotier|hamachi|radmin/i

export type GameServerStatus = 'STARTING' | 'READY' | 'FAILED'

export interface GameServerState {
	matchId: string
	map: string
	status: GameServerStatus
	address: string | null
	error?: string
}

@Injectable()
export class GameServerService implements OnModuleDestroy {
	private readonly logger = new Logger(GameServerService.name)
	private process: ChildProcess | null = null
	private state: GameServerState | null = null
	private readyPoll: NodeJS.Timeout | null = null

	constructor(
		private readonly eventEmitter: EventEmitter2,
		private readonly liveMatchService: LiveMatchService
	) {}

	private get port(): number {
		return Number(process.env.CS2_SERVER_PORT ?? '27015')
	}

	private setState(state: GameServerState) {
		this.state = state
		this.eventEmitter.emit('match.serverStatus', state)
	}

	private fail(matchId: string, error: string) {
		this.logger.error(`CS2 server for match ${matchId} failed: ${error}`)
		this.stopReadyPoll()

		if (this.state?.matchId === matchId) {
			this.setState({ ...this.state, status: 'FAILED', address: null, error })
		}
	}

	start(matchId: string, map: string): void {
		if (this.state?.matchId === matchId && this.state.status !== 'FAILED') {
			this.logger.warn(`Server already started for match ${matchId}`)
			return
		}

		this.setState({ matchId, map, status: 'STARTING', address: null })

		if (!ALLOWED_MAPS.has(map)) {
			return this.fail(matchId, `Unsupported CS2 map: ${map}`)
		}

		const executablePath = process.env.CS2_SERVER_EXE
		if (!executablePath) {
			return this.fail(matchId, 'CS2_SERVER_EXE is not configured')
		}

		// Only one local server can bind the port, so replace the previous one
		this.killProcess()

		const workingDirectory =
			process.env.CS2_SERVER_CWD ?? 'D:\\CS2Server\\game\\bin\\win64'

		this.logger.log(`Starting CS2 server for match ${matchId}, map ${map}`)

		const args = ['-dedicated', '-port', String(this.port), '+map', map]

		const liveConfig = this.writeLiveLogConfig(matchId, workingDirectory)
		if (liveConfig) {
			args.push('+exec', liveConfig)
		}

		const child = spawn(
			executablePath,
			args,
			{
				cwd: workingDirectory,
				shell: false,
				stdio: 'inherit',
				windowsHide: false
			}
		)

		this.process = child

		child.once('error', error => {
			if (this.process === child) {
				this.process = null
			}
			this.fail(matchId, `Failed to start process: ${error.message}`)
		})

		child.once('exit', (code, signal) => {
			this.logger.log(`CS2 server exited (code=${code}, signal=${signal})`)

			if (this.process !== child) {
				return
			}

			this.process = null

			if (this.state?.matchId === matchId) {
				this.fail(matchId, `Server process exited (code=${code})`)
			}
		})

		this.waitUntilReady(matchId)
	}

	stop(matchId: string): void {
		if (this.state?.matchId !== matchId) {
			return
		}

		this.logger.log(`Stopping CS2 server for match ${matchId}`)
		this.state = null
		this.liveMatchService.clear(matchId)
		this.killProcess()
	}

	/**
	 * Writes a cfg that streams the server log to our backend. A cfg is used
	 * instead of command line args because Source treats `//` in a URL as a comment.
	 * Returns the cfg name for `+exec`, or null when live stats are disabled.
	 */
	private writeLiveLogConfig(
		matchId: string,
		workingDirectory: string
	): string | null {
		const token = process.env.CS2_LOG_TOKEN

		if (!token) {
			this.logger.warn('CS2_LOG_TOKEN is not set, live match stats are disabled')
			return null
		}

		const baseUrl =
			process.env.CS2_LOG_BASE_URL ??
			`http://127.0.0.1:${process.env.APPLICATION_PORT ?? '8080'}`

		const cfgDirectory =
			process.env.CS2_SERVER_CFG_DIR ??
			resolve(workingDirectory, '..', '..', 'csgo', 'cfg')

		const cfgName = 'faceit_live'

		try {
			writeFileSync(
				join(cfgDirectory, `${cfgName}.cfg`),
				[
					'log on',
					'logaddress_delall_http',
					`logaddress_add_http "${baseUrl}/game-server/${matchId}/log/${token}"`,
					''
				].join('\n')
			)
		} catch (error) {
			this.logger.error(
				`Could not write ${cfgName}.cfg to ${cfgDirectory}: ${(error as Error).message}`
			)
			return null
		}

		return cfgName
	}

	getState(matchId: string): GameServerState | null {
		return this.state?.matchId === matchId ? this.state : null
	}

	getConnectionAddress(): string {
		const configuredHost = process.env.CS2_SERVER_HOST

		if (configuredHost) {
			return `${configuredHost}:${this.port}`
		}

		const candidates: { name: string; address: string }[] = []

		for (const [name, addresses] of Object.entries(networkInterfaces())) {
			if (IGNORED_INTERFACES.test(name)) {
				continue
			}

			for (const address of addresses ?? []) {
				if (address.family === 'IPv4' && !address.internal) {
					candidates.push({ name, address: address.address })
				}
			}
		}

		// Home routers almost always use 192.168.x.x, so prefer it over 10.x / 172.x
		const rank = (ip: string) => {
			if (ip.startsWith('192.168.')) return 0
			if (ip.startsWith('10.')) return 1
			if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return 2
			if (ip.startsWith('169.254.')) return 4
			return 3
		}

		candidates.sort((a, b) => rank(a.address) - rank(b.address))

		const best = candidates[0]

		if (!best) {
			throw new Error(
				'Could not determine local IPv4 address. Set CS2_SERVER_HOST in .env'
			)
		}

		this.logger.log(`Using ${best.address} (${best.name}) as server host`)

		return `${best.address}:${this.port}`
	}

	private waitUntilReady(matchId: string) {
		this.stopReadyPoll()

		const startedAt = Date.now()

		const poll = async () => {
			if (this.state?.matchId !== matchId || this.state.status !== 'STARTING') {
				return
			}

			if (await this.isResponding()) {
				try {
					const address = this.getConnectionAddress()
					this.logger.log(`CS2 server for match ${matchId} is ready at ${address}`)
					this.setState({ ...this.state, status: 'READY', address })
				} catch (error) {
					this.fail(matchId, (error as Error).message)
				}
				return
			}

			if (Date.now() - startedAt > READY_TIMEOUT) {
				return this.fail(matchId, 'Server did not respond in time')
			}

			this.readyPoll = setTimeout(poll, READY_POLL_INTERVAL)
		}

		this.readyPoll = setTimeout(poll, READY_POLL_INTERVAL)
	}

	private isResponding(): Promise<boolean> {
		return new Promise(resolve => {
			const socket = createSocket('udp4')

			const finish = (result: boolean) => {
				clearTimeout(timeout)
				socket.close()
				resolve(result)
			}

			const timeout = setTimeout(() => finish(false), 1_000)

			socket.once('message', () => finish(true))
			socket.once('error', () => finish(false))
			socket.send(A2S_INFO_REQUEST, this.port, '127.0.0.1')
		})
	}

	private stopReadyPoll() {
		if (this.readyPoll) {
			clearTimeout(this.readyPoll)
			this.readyPoll = null
		}
	}

	private killProcess() {
		this.stopReadyPoll()

		if (this.process) {
			const child = this.process
			this.process = null
			child.kill()
		}
	}

	onModuleDestroy(): void {
		this.state = null
		this.killProcess()
	}
}
