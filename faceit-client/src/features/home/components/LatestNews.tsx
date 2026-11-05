'use client';

import Link from 'next/link';

import { NewsCard } from '@/features/news/components/NewsCard';
import { Loader } from '@/shared/components/ui/Loader';
import { useGetNewsQuery } from '@/store/api/newsApi';

import { HomeSection } from './HomeSection';

export function LatestNews() {
	const { data, isLoading, isError } = useGetNewsQuery({ page: 1, limit: 4 });

	return (
		<HomeSection title="Latest news" href="/news">
			{isLoading ? (
				<Loader />
			) : isError ? (
				<p className="text-sm text-neutral-400">Unable to load news</p>
			) : !data?.news.length ? (
				<p className="rounded-xl bg-primary p-4 text-sm text-neutral-400">
					No news yet
				</p>
			) : (
				<ul className="flex flex-col gap-3">
					{data.news.map((item) => (
						<li key={item.id}>
							<Link
								href={`/news#${item.id}`}
								className="group block"
							>
								<NewsCard news={item} descriptionLimit={160} />
							</Link>
						</li>
					))}
				</ul>
			)}
		</HomeSection>
	);
}
