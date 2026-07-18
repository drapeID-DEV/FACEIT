import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
	before: number;
	after: number;
}

export function MatchElo({ before, after }: Props) {
	const diff = after - before;

	const positive = diff >= 0;

	return (
		<div className="flex flex-col items-center">
			<p className="font-semibold">{after.toLocaleString()}</p>

			<div
				className={`flex items-center text-sm font-semibold ${
					positive ? 'text-green-500' : 'text-red-500'
				}`}
			>
				{positive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}

				{Math.abs(diff)}
			</div>
		</div>
	);
}
