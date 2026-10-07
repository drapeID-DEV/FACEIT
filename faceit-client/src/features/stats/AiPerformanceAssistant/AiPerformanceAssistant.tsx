'use client';

import { useEffect, useState } from 'react';

import {
	useGetPlayerRecommendationsQuery,
	useLazyGetPlayerRecommendationsQuery
} from '@/store/api/playerApi';

import { IAiRecommendationsResponse } from '@/shared/types/stats';

interface Props {
	nickname: string;
}

export function AiPerformanceAssistant({ nickname }: Props) {
	const { data, isLoading, isFetching, isError, refetch } =
		useGetPlayerRecommendationsQuery({
			nickname
		});

	const [regenerateRecommendations, { isFetching: isRegenerating }] =
		useLazyGetPlayerRecommendationsQuery();

	const [recommendations, setRecommendations] =
		useState<IAiRecommendationsResponse | null>(null);

	useEffect(() => {
		if (data) {
			setRecommendations(data);
		}
	}, [data]);

	const handleRegenerate = async () => {
		setRecommendations(null);

		const result = await regenerateRecommendations({
			nickname,
			regenerate: true
		});

		if (result.data) {
			setRecommendations(result.data);
		}
	};

	if (isLoading) {
		return (
			<section className="w-full rounded-xl border border-white/10 bg-primary p-6">
				<div className="mb-5">
					<h3 className="text-lg font-semibold">
						AI Performance Assistant
					</h3>
					<p className="text-sm text-white/50">
						Analyzing your performance...
					</p>
				</div>

				<div className="space-y-3">
					<div className="h-4 animate-pulse rounded bg-white/5" />
					<div className="h-4 animate-pulse rounded bg-white/5" />
					<div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
				</div>
			</section>
		);
	}

	if (isError) {
		return (
			<section className="w-full rounded-xl border border-white/10 bg-primary p-6">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h3 className="text-lg font-semibold">
							AI Performance Assistant
						</h3>

						<p className="text-sm text-white/50">
							Unable to generate performance recommendations.
						</p>
					</div>

					<button
						type="button"
						onClick={() => refetch()}
						className="rounded-lg border border-white/10 px-4 py-2 text-sm text-widget transition-colors hover:bg-white/5"
					>
						Try again
					</button>
				</div>
			</section>
		);
	}

	if (!recommendations?.recommendations?.length && !isRegenerating) {
		return null;
	}

	return (
		<section className="w-full rounded-xl border border-white/10 bg-primary p-6">
			<div className="mb-5 flex items-center justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold">
						AI Performance Assistant
					</h3>

					<p className="text-sm text-white/50">
						Personalized recommendations based on your statistics
					</p>
				</div>

				<button
					type="button"
					onClick={handleRegenerate}
					disabled={isRegenerating}
					className="rounded-lg border border-white/10 px-3 py-2 text-sm text-widget transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isRegenerating ? 'Analyzing...' : 'Regenerate'}
				</button>
			</div>

			{isRegenerating ? (
				<div className="space-y-3">
					<div className="h-4 animate-pulse rounded bg-white/5" />
					<div className="h-4 animate-pulse rounded bg-white/5" />
					<div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
				</div>
			) : (
				<div className="space-y-3">
					{recommendations?.recommendations.map(
						(recommendation, index) => (
							<div
								key={`${recommendation.title}-${index}`}
								className="rounded-lg border border-white/10 bg-black p-4"
							>
								<div className="mb-4 flex items-center justify-between gap-4">
									<h4 className="font-medium text-widget">
										{recommendation.title}
									</h4>

									<span className="rounded-full bg-white/10 px-2.5 py-1 text-xs uppercase text-white/60">
										{recommendation.priority}
									</span>
								</div>

								<p className="text-sm leading-6 text-white/60">
									{recommendation.description}
								</p>
							</div>
						)
					)}
				</div>
			)}
		</section>
	);
}
