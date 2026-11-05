'use client';

import { useState } from 'react';

import { TApiError } from '@/shared/types/api/responses';
import { INews } from '@/shared/types/news';
import { notification } from '@/shared/utils/notifications';
import { useDeleteNewsMutation } from '@/store/api/newsApi';

import { NewsCard } from './NewsCard';
import { NewsForm } from './NewsForm';

interface Props {
	news: INews;
}

export function AdminNewsCard({ news }: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const [deleteNews, { isLoading }] = useDeleteNewsMutation();

	const handleDelete = async () => {
		if (!window.confirm(`Delete "${news.title}"?`)) {
			return;
		}

		try {
			await deleteNews(news.id).unwrap();
			notification.info('News deleted!');
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	if (isEditing) {
		return <NewsForm news={news} onDone={() => setIsEditing(false)} />;
	}

	return (
		<NewsCard
			news={news}
			actions={
				<div className="flex gap-2 text-sm">
					<button
						type="button"
						onClick={() => setIsEditing(true)}
						className="rounded-md px-3 py-1 duration-200 hover:bg-neutral-700"
					>
						Edit
					</button>
					<button
						type="button"
						onClick={handleDelete}
						disabled={isLoading}
						className="rounded-md px-3 py-1 text-red-500 duration-200 hover:bg-neutral-700 disabled:opacity-50"
					>
						Delete
					</button>
				</div>
			}
		/>
	);
}
