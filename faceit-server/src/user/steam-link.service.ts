import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

const STEAM_OPENID_URL = 'https://steamcommunity.com/openid/login'
const OPENID_NS = 'http://specs.openid.net/auth/2.0'
const IDENTIFIER_SELECT = 'http://specs.openid.net/auth/2.0/identifier_select'
const CLAIMED_ID = /^https:\/\/steamcommunity\.com\/openid\/id\/(7656119\d{10})$/

/**
 * Proves Steam account ownership with Steam's OpenID 2.0 sign-in.
 * The SteamID64 is only trusted after Steam confirms the response (check_authentication).
 */
@Injectable()
export class SteamLinkService {
	private readonly logger = new Logger(SteamLinkService.name)

	constructor(private readonly configService: ConfigService) {}

	private get returnTo() {
		return `${this.realm}/users/steam/callback`
	}

	private get realm() {
		// .env may hold e.g. 'http://localhost:${APPLICATION_PORT}', ConfigModule does not expand it
		return this.configService
			.getOrThrow<string>('APPLICATION_URL')
			.replace(/\$\{(\w+)\}/g, (_, key: string) =>
				this.configService.getOrThrow<string>(key)
			)
			.replace(/\/$/, '')
	}

	buildLoginUrl(): string {
		const params = new URLSearchParams({
			'openid.ns': OPENID_NS,
			'openid.mode': 'checkid_setup',
			'openid.return_to': this.returnTo,
			'openid.realm': this.realm,
			'openid.identity': IDENTIFIER_SELECT,
			'openid.claimed_id': IDENTIFIER_SELECT
		})

		return `${STEAM_OPENID_URL}?${params.toString()}`
	}

	/** Returns the verified SteamID64, or null if the response is invalid */
	async verify(query: Record<string, unknown>): Promise<string | null> {
		const openid = Object.fromEntries(
			Object.entries(query).filter(
				(entry): entry is [string, string] =>
					entry[0].startsWith('openid.') && typeof entry[1] === 'string'
			)
		)

		if (
			openid['openid.mode'] !== 'id_res' ||
			openid['openid.op_endpoint'] !== STEAM_OPENID_URL ||
			!openid['openid.return_to']?.startsWith(this.returnTo)
		) {
			return null
		}

		const steamId = CLAIMED_ID.exec(openid['openid.claimed_id'] ?? '')?.[1]

		if (!steamId || openid['openid.identity'] !== openid['openid.claimed_id']) {
			return null
		}

		try {
			const response = await fetch(STEAM_OPENID_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({
					...openid,
					'openid.mode': 'check_authentication'
				}).toString()
			})

			const body = await response.text()

			return /^is_valid\s*:\s*true$/m.test(body) ? steamId : null
		} catch (error) {
			this.logger.error(
				`Steam OpenID verification failed: ${(error as Error).message}`
			)
			return null
		}
	}
}
