import Link from 'next/link';
import { useDispatch } from 'react-redux';

import { NewsCard } from '@/features/news/components/NewsCard';
import { INews } from '@/shared/types/news';
import { closePopupMenu } from '@/store/slices/SidebarStateSlice';
import { AppDispatch } from '@/store/store';

const DESCRIPTION_LIMIT = 120;

interface Props {
	news: INews;
}

export function PopupNewsCard({ news }: Props) {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<Link
			href={`/news#${news.id}`}
			className="group block"
			onClick={() => dispatch(closePopupMenu())}
		>
			<NewsCard news={news} descriptionLimit={DESCRIPTION_LIMIT} />
		</Link>
	);
}
