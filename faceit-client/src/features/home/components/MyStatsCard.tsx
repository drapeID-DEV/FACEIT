'use client';

import { skipToken } from '@reduxjs/toolkit/query';

import { Loader } from '@/shared/components/ui/Loader';
import { PlayerAvatar } from '@/shared/components/ui/PlayerAvatar';
import { WidgetBtn } from '@/shared/components/ui/WidgetBtn';
import { useGetMyRankQuery } from '@/store/api/leaderboardApi';
import { useGetCurrentMatchQuery } from '@/store/api/matchmakingApi';
import { useGetPlayerStatisticsQuery } from '@/store/api/playerApi';
import { useGetMeQuery } from '@/store/api/userApi';

export function MyStatsCard() {
	const { data: me, isLoading } = useGetMeQuery();
	const { data: rank } = useGetMyRankQuery();
	const { data: stats } = useGetPlayerStatisticsQuery(
		me?.nickname ?? skipToken
	);
	const { data: currentMatch } = useGetCurrentMatchQuery();

	if (isLoading) {
		return (
			<div className="flex justify-center rounded-2xl bg-primary p-8">
				<Loader />
			</div>
		);
	}

	if (!me) {
		return null;
	}

	const items = [
		{ label: 'ELO', value: me.elo },
		{ label: 'Rank', value: rank ? `#${rank.rank}` : '-' },
		{
			label: 'W / L',
			value: `${stats?.wins ?? 0} / ${stats?.losses ?? 0}`
		},
		{ label: 'K/D', value: (stats?.kd ?? 0).toFixed(2) }
	];

	return (
		<section className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-primary p-6">
			<div className="flex min-w-0 items-center gap-4">
				<PlayerAvatar
					nickname={me.nickname}
					profilePic={me.profilePic}
					className="h-16 w-16 text-xl"
				/>
				<div className="min-w-0">
					<p className="text-sm text-neutral-400">Welcome back</p>
					<h1 className="truncate text-2xl font-bold">
						{me.nickname}
					</h1>
				</div>
			</div>
			<dl className="flex flex-wrap gap-x-8 gap-y-3">
				{items.map((item) => (
					<div key={item.label}>
						<dt className="text-xs uppercase tracking-wide text-neutral-400">
							{item.label}
						</dt>
						<dd className="text-xl font-semibold">{item.value}</dd>
					</div>
				))}
			</dl>
			{currentMatch?.hasActiveMatch ? (
				<WidgetBtn
					isLink
					title="Back to match"
					href={`/match/${currentMatch.match?.id}`}
				/>
			) : (
				<WidgetBtn isLink title="Play" href="/matchmaking" />
			)}
		</section>
	);
}
