import session from 'express-session'
import 'http'

declare module 'http' {
	interface IncomingMessage {
		session: session.Session &
			Partial<session.SessionData> & {
				userId?: string
			}
	}
}
