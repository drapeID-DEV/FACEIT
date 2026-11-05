'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { NewsCard } from '@/features/news/components/NewsCard';
import { Loader } from '@/shared/components/ui/Loader';
import { useSearchQuery } from '@/store/api/searchApi';

import { HomeSection } from './HomeSection';
import { PlayerRow } from './PlayerRow';

type Tab = 'overview' | 'players' | 'news';

const TABS: { key: Tab; label: string }[] = [
	{ key: 'overview', label: 'Overview' },
	{ key: 'players', label: 'Players' },
	{ key: 'news', label: 'News' }
];

const OVERVIEW_LIMIT = 6;
const FULL_LIMIT = 50;

interface Props {
	query: string;
}

export function SearchResults({ query }: Props) {
	const [activeTab, setActiveTab] = useState<Tab>('overview');

	const { data, isLoading, isError } = useSearchQuery({
		q: query,
		limit: activeTab === 'overview' ? OVERVIEW_LIMIT : FULL_LIMIT
	});

	const showPlayers = activeTab !== 'news';
	const showNews = activeTab !== 'players';
	const isOverview = activeTab === 'overview';

	return (
		<div className="flex flex-col gap-6">
			<nav className="flex gap-6 border-b border-neutral-800">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						type="button"
						onClick={() => setActiveTab(tab.key)}
						className={clsx(
							'-mb-px border-b-2 pb-2 text-sm font-semibold uppercase duration-200',
							activeTab === tab.key
								? 'border-widget text-widget'
								: 'border-transparent text-neutral-400 hover:text-white'
						)}
					>
						{tab.label}
					</button>
				))}
			</nav>

			{isLoading ? (
				<div className="flex justify-center py-6">
					<Loader />
				</div>
			) : isError || !data ? (
				<p className="text-neutral-400">Unable to search right now</p>
			) : data.playersTotal + data.newsTotal === 0 ? (
				<p className="text-neutral-400">
					Nothing found for &quot;{query}&quot;
				</p>
			) : (
				<>
					{showPlayers && (
						<HomeSection
							title="Players"
							subtitle={`Results: ${data.playersTotal}`}
							onLinkClick={
								isOverview &&
								data.playersTotal > data.players.length
									? () => setActiveTab('players')
									: undefined
							}
						>
							{data.players.length === 0 ? (
								<p className="text-sm text-neutral-400">
									No players found
								</p>
							) : (
								<ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
									{data.players.map((player) => (
										<li key={player.id}>
											<PlayerRow player={player} />
										</li>
									))}
								</ul>
							)}
						</HomeSection>
					)}
					{showNews && (
						<HomeSection
							title="News"
							subtitle={`Results: ${data.newsTotal}`}
							onLinkClick={
								isOverview && data.newsTotal > data.news.length
									? () => setActiveTab('news')
									: undefined
							}
						>
							{data.news.length === 0 ? (
								<p className="text-sm text-neutral-400">
									No news found
								</p>
							) : (
								<ul className="flex flex-col gap-2">
									{data.news.map((item) => (
										<li key={item.id}>
											<Link
												href={`/news#${item.id}`}
												className="group block"
											>
												<NewsCard
													news={item}
													descriptionLimit={160}
												/>
											</Link>
										</li>
									))}
								</ul>
							)}
						</HomeSection>
					)}
				</>
			)}
		</div>
	);
}
