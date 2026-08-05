import { PropsWithChildren } from 'react';
import { StatisticsHeader } from './StatisticsHeader';

export function ChartContainer({ children }: PropsWithChildren) {
	return (
		<div className="bg-primary text-center py-8 px-5 rounded-2xl">
			<StatisticsHeader />
			{children}
		</div>
	);
}
