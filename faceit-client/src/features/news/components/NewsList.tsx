'use client';

import { useEffect, useRef, useState } from 'react';

import { Loader } from '@/shared/components/ui/Loader';
import { useGetNewsQuery } from '@/store/api/newsApi';
import { useGetMeQuery } from '@/store/api/userApi';

import { AdminNewsCard } from './AdminNewsCard';
import { NewsCard } from './NewsCard';
import { NewsForm } from './NewsForm';

const PAGE_LIMIT = 10;

const pageButtonClassName =
	'rounded-md bg-accent px-4 py-2 text-sm duration-200 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50';

export function NewsList() {
	const [page, setPage] = useState(1);

	const { data: me } = useGetMeQuery();
	const { data, isLoading, isFetching, isError } = useGetNewsQuery({
		page,
		limit: PAGE_LIMIT
	});

	const isAdmin = me?.role === 'ADMIN';
	const totalPages = data?.totalPages ?? 0;

	// Deleting the only item on the last page would leave an empty page behind
	if (data && page > 1 && page > data.totalPages) {
		setPage(Math.max(data.totalPages, 1));
	}

	// A popup link can land here before the news loads, too early for the browser to find the item
	const hasScrolledToHash = useRef(false);

	useEffect(() => {
		if (!data || hasScrolledToHash.current) {
			return;
		}

		hasScrolledToHash.current = true;

		const id = window.location.hash.slice(1);

		if (id) {
			document.getElementById(id)?.scrollIntoView();
		}
	}, [data]);

	return (
		<div className="flex min-w-0 flex-col gap-8">
			<h1 className="text-4xl font-semibold">News</h1>
			{isAdmin && <NewsForm />}
			{isLoading ? (
				<Loader />
			) : isError || !data ? (
				<div>Failed to load news</div>
			) : data.news.length === 0 ? (
				<p className="text-neutral-400">No news yet</p>
			) : (
				<>
					<ul className="flex flex-col gap-4">
						{data.news.map((item) => (
							<li key={item.id} id={item.id} className="scroll-mt-5">
								{isAdmin ? (
									<AdminNewsCard news={item} />
								) : (
									<NewsCard news={item} />
								)}
							</li>
						))}
					</ul>
					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-4">
							<button
								type="button"
								className={pageButtonClassName}
								disabled={page <= 1 || isFetching}
								onClick={() => setPage(page - 1)}
							>
								Previous
							</button>
							<span className="text-sm text-neutral-400">
								{page} / {totalPages}
							</span>
							<button
								type="button"
								className={pageButtonClassName}
								disabled={page >= totalPages || isFetching}
								onClick={() => setPage(page + 1)}
							>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
