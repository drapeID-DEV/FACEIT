export type RecommendationPriority = 'high' | 'medium' | 'low'

export interface IAiRecommendation {
	title: string
	description: string
	priority: RecommendationPriority
}

export interface IAiRecommendationsResponse {
	recommendations: IAiRecommendation[]
}
