import { NewsList } from '@/features/news/components/NewsList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'News',
	description: 'Latest FACEIT platform news and announcements'
};

export default async function NewsPage() {
	return <NewsList />;
}
