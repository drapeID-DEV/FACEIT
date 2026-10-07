import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { createHash } from 'crypto'

import { PrismaService } from '@/prisma/prisma.service'
import { StatsService } from '@/stats/stats.service'

import { IAiRecommendationsResponse } from './types/ai-recommendation.types'

@Injectable()
export class AiService {
	private readonly baseUrl =
		process.env.AI_BASE_URL ?? 'http://localhost:11434'

	private readonly model = process.env.AI_MODEL ?? 'qwen3:4b'

	constructor(
		private readonly statsService: StatsService,
		private readonly prisma: PrismaService
	) {}

	async generatePlayerRecommendations(
		userId: string,
		regenerate = false
	): Promise<IAiRecommendationsResponse | null> {
		const statistics = await this.statsService.getPlayerStatistics(userId)

		if (!statistics) {
			return null
		}

		const statisticsHash = createHash('sha256')
			.update(JSON.stringify(statistics))
			.digest('hex')

		if (!regenerate) {
			const cached = await this.prisma.aiRecommendation.findUnique({
				where: {
					userId
				}
			})

			if (cached && cached.statisticsHash === statisticsHash) {
				return cached.recommendations as unknown as IAiRecommendationsResponse
			}
		}

		const prompt = `
You are an esports performance assistant.

Analyze the player's CS2 statistics and provide 1 to 3 personalized
recommendations for improving their performance.

Player statistics:
${JSON.stringify(statistics, null, 2)}

IMPORTANT: SAMPLE SIZE

- If matches = 0, there is no gameplay data.
  Do not interpret zero statistics as poor performance.
  Explain that the player needs to play matches before meaningful
  performance recommendations can be generated.

- If matches < 5, the sample is very small.
  Avoid strong conclusions and clearly communicate uncertainty.

- If matches < 10, treat conclusions as preliminary.

- If matches >= 10, the statistics can be used for meaningful
  performance analysis.

Always consider the number of matches when interpreting statistics.

ANALYSIS

Analyze the player's statistics holistically.

Consider:
- number of matches
- win rate
- K/D ratio
- average kills
- average deaths
- average assists
- headshot rate
- MVP rounds
- ELO

Identify the most significant weaknesses based on the actual numbers.

Recommendations must:
- be personalized to the player's statistics;
- be based only on the provided data;
- focus on the most significant weaknesses;
- be practical and actionable;
- be concise;
- mention the relevant statistic when it helps explain the recommendation;
- use priority: high, medium, or low.

Do not:
- invent statistics;
- invent gameplay information;
- make assumptions about the player's playstyle that are not supported
  by the statistics;
- give generic advice that could apply equally to every player;
- recommend improving a metric that is already relatively strong;
- interpret zero values as poor performance when matches = 0.

When possible, explain the reason for each recommendation using
the player's actual statistics.

For example, if the player's K/D is 0.90 and they have played
10 matches, the recommendation may mention that the player has
more deaths than kills.

OUTPUT

Return ONLY valid JSON.
Do not use markdown.
Do not include any text outside the JSON object.

The JSON format must be:

{
  "recommendations": [
    {
      "title": "Short recommendation title",
      "description": "Practical explanation based on the player's statistics",
      "priority": "high"
    }
  ]
}
`

		try {
			const response = await fetch(`${this.baseUrl}/api/generate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: this.model,
					prompt,
					stream: false,
					format: 'json'
				})
			})

			if (!response.ok) {
				throw new Error(`Ollama returned ${response.status}`)
			}

			const data = await response.json()

			const recommendations = JSON.parse(
				data.response
			) as IAiRecommendationsResponse

			const recommendationsJson = JSON.parse(
				JSON.stringify(recommendations)
			)

			await this.prisma.aiRecommendation.upsert({
				where: {
					userId
				},
				update: {
					recommendations: recommendationsJson,
					statisticsHash
				},
				create: {
					userId,
					recommendations: recommendationsJson,
					statisticsHash
				}
			})

			return recommendations
		} catch (error) {
			console.error('AI recommendation error:', error)

			throw new InternalServerErrorException(
				'Failed to generate AI recommendations'
			)
		}
	}
}
