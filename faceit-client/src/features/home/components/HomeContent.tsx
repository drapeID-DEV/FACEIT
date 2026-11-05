'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

import { LatestNews } from './LatestNews';
import { MyStatsCard } from './MyStatsCard';
import { RecentMatches } from './RecentMatches';
import { SearchResults } from './SearchResults';
import { TopPlayers } from './TopPlayers';

const SEARCH_DEBOUNCE = 300;
const MIN_QUERY_LENGTH = 2;

export function HomeContent() {
	const [value, setValue] = useState('');
	const [query, setQuery] = useState('');

	useEffect(() => {
		const timeout = setTimeout(
			() => setQuery(value.trim()),
			SEARCH_DEBOUNCE
		);

		return () => clearTimeout(timeout);
	}, [value]);

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
			<div className="flex items-center gap-3 rounded-2xl bg-primary px-5 py-4 focus-within:ring-1 focus-within:ring-widget">
				<Search size={20} className="shrink-0 text-neutral-400" />
				<input
					type="search"
					value={value}
					onChange={(event) => setValue(event.target.value)}
					placeholder="Search players and news"
					aria-label="Search players and news"
					className="w-full bg-transparent text-lg outline-none placeholder:text-neutral-500 [&::-webkit-search-cancel-button]:hidden"
				/>
				{value && (
					<button
						type="button"
						aria-label="Clear search"
						onClick={() => setValue('')}
						className="text-neutral-400 duration-200 hover:text-white"
					>
						<X size={20} />
					</button>
				)}
			</div>

			{query.length >= MIN_QUERY_LENGTH ? (
				<SearchResults query={query} />
			) : (
				<>
					<MyStatsCard />
					<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
						<LatestNews />
						<div className="flex flex-col gap-6">
							<TopPlayers />
							<RecentMatches />
						</div>
					</div>
				</>
			)}
		</div>
	);
}
