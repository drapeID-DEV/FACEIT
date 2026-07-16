import { format } from 'date-fns';

interface Props {
	finishedAt: string | null;
}

export function MatchDate({ finishedAt }: Props) {
	if (!finishedAt) {
		return (
			<div>
				<p>In progress</p>
			</div>
		);
	}

	const date = new Date(finishedAt);

	return (
		<div className="flex flex-col">
			<p className="font-semibold">{format(date, 'dd MMM')}</p>

			<p className="text-xs text-neutral-500">{format(date, 'HH:mm')}</p>
		</div>
	);
}
