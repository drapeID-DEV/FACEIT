import { Loader } from '@/shared/components/ui/Loader';
import { useGetNewsQuery } from '@/store/api/newsApi';
import { PopupNewsCard } from './PopupNewsCard';

export function NewsPopup() {
	const { data, isLoading } = useGetNewsQuery({ page: 1, limit: 10 });

	if (isLoading) {
		return (
			<div className="flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!data) {
		return <p className="text-sm text-center">Unable to load news</p>;
	}

	if (data.news.length === 0) {
		return <p className="text-sm text-center">No news yet</p>;
	}

	return (
		<ul className="flex flex-col gap-3 px-5 mb-3 overflow-y-auto">
			{data.news.map((item) => (
				<li key={item.id}>
					<PopupNewsCard news={item} />
				</li>
			))}
		</ul>
	);
}
