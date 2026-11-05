import { ReactNode } from 'react';
import { format } from 'date-fns';

import { INews } from '@/shared/types/news';

interface Props {
	news: INews;
	actions?: ReactNode;
	descriptionLimit?: number;
}

export function NewsCard({ news, actions, descriptionLimit }: Props) {
	const description =
		descriptionLimit && news.description.length > descriptionLimit
			? `${news.description.slice(0, descriptionLimit).trimEnd()}...`
			: news.description;

	return (
		<article className="flex w-full flex-col gap-2 rounded-xl bg-accent p-4 duration-200 group-hover:bg-neutral-700">
			<h3 className="text-lg font-semibold break-words text-widget">
				{news.title}
			</h3>
			<p className="text-sm whitespace-pre-wrap break-words text-neutral-300">
				{description}
			</p>
			<div className="flex items-center justify-between gap-3">
				<time
					dateTime={news.createdAt}
					className="text-xs text-neutral-400"
				>
					{format(new Date(news.createdAt), 'dd MMM yyyy')}
				</time>
				{actions}
			</div>
		</article>
	);
}
