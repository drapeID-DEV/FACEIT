// Timings for section 4.3 of the diploma. Needs the backend running on the faceit_bench database
// with test/perf/bench-data.sql applied. Usage: node test/perf/measure.mjs [teams|log|ai]
import 'dotenv/config'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const BASE = `http://localhost:${process.env.APPLICATION_PORT}`

function summary(values) {
	const sorted = [...values].sort((a, b) => a - b)
	const pick = fraction => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))]

	return {
		runs: sorted.length,
		min: +sorted[0].toFixed(3),
		median: +pick(0.5).toFixed(3),
		p95: +pick(0.95).toFixed(3),
		max: +sorted[sorted.length - 1].toFixed(3)
	}
}

async function login() {
	const response = await fetch(`${BASE}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: 'demo_1@demo.local', password: 'demo-password-1' })
	})

	if (!response.ok) throw new Error(`Login failed: ${response.status}`)

	return response.headers.get('set-cookie').split(';')[0]
}

function teams() {
	const { buildTeams } = require('../../dist/matchmaking/build-teams.js')

	const queue = (size, partySize) =>
		Array.from({ length: size }, (_, index) => ({
			players: Array.from({ length: partySize(index) }, () => ({ elo: 1000 + (index % 200) })),
			joinedAt: new Date(index)
		}))

	const shapes = {
		'10 solo players': queue(10, () => 1),
		'50 solo players': queue(50, () => 1),
		'200 solo players': queue(200, () => 1),
		'50 entries with mixed party sizes': queue(50, index => (index % 3) + 1),
		'200 entries with mixed party sizes': queue(200, index => (index % 3) + 1),
		// No valid match exists, so the search cannot stop early
		'200 entries, all parties of 4': queue(200, () => 4)
	}

	for (const [name, entries] of Object.entries(shapes)) {
		const times = []

		for (let run = 0; run < 200; run++) {
			const start = performance.now()
			buildTeams(entries, entries[0], 5, 300)
			times.push(performance.now() - start)
		}

		console.log(name, JSON.stringify(summary(times)))
	}
}

async function log() {
	const { io } = require('../../../faceit-client/node_modules/socket.io-client')
	const cookie = await login()
	const socket = io(BASE, { transports: ['websocket'], extraHeaders: { cookie } })

	await new Promise((resolve, reject) => {
		socket.once('connect', resolve)
		socket.once('connect_error', reject)
	})
	socket.emit('joinMatch', { matchId: 'bench-live' })
	await new Promise(resolve => setTimeout(resolve, 300))

	const post = body =>
		fetch(`${BASE}/game-server/bench-live/log/${process.env.CS2_LOG_TOKEN}`, {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' },
			body
		})

	async function timeLine(body) {
		const received = new Promise((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error('No liveStats within 5 s')), 5000)

			socket.once('liveStats', () => {
				clearTimeout(timer)
				resolve(performance.now())
			})
		})
		const start = performance.now()
		await post(body)

		return (await received) - start
	}

	const kill =
		'"PlayerOne<2><[U:1:1001]><CT>" [0 0 0] killed "PlayerTwo<3><[U:1:1002]><TERRORIST>" [0 0 0] with "ak47"'
	const times = { kill: [], roundEndWithSave: [] }

	// The first log line loads the match from the database, so it is measured separately
	console.log('first line ms', (await timeLine(kill)).toFixed(3))

	for (let run = 0; run < 300; run++) {
		times.kill.push(await timeLine(kill))
		await new Promise(resolve => setTimeout(resolve, 10))
	}

	for (let run = 1; run <= 100; run++) {
		times.roundEndWithSave.push(
			await timeLine(`Team "CT" scored "${run}" with "1" players\nWorld triggered "Round_End"`)
		)
		await new Promise(resolve => setTimeout(resolve, 10))
	}

	console.log('kill line', JSON.stringify(summary(times.kill)))
	console.log('round end with database save', JSON.stringify(summary(times.roundEndWithSave)))
	socket.close()
}

async function ai() {
	const cookie = await login()
	const url = `${BASE}/ai/player/demo_1/recommendations`

	async function timed(target) {
		const start = performance.now()
		const response = await fetch(target, { headers: { cookie }, signal: AbortSignal.timeout(280000) })
		await response.text()

		return { ms: performance.now() - start, status: response.status }
	}

	const generated = []

	for (let run = 0; run < 3; run++) {
		const result = await timed(`${url}?regenerate=true`)
		console.log('generate', result.status, Math.round(result.ms))
		generated.push(result.ms)
	}

	const cached = []

	for (let run = 0; run < 20; run++) {
		const result = await timed(url)
		cached.push(result.ms)
	}

	console.log('generated', JSON.stringify(summary(generated)))
	console.log('cached', JSON.stringify(summary(cached)))
}

const tasks = { teams, log, ai }
await tasks[process.argv[2]]()
process.exit(0)
