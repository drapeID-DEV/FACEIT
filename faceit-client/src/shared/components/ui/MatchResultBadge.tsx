interface Props {
	isWinner: boolean;
}

export function MatchResultBadge({ isWinner }: Props) {
	return (
		<p
			className={`w-6 h-6 rounded font-bold text-xs flex items-center justify-center ${
				isWinner ? 'bg-green-500' : 'bg-red-500'
			}`}
		>
			{isWinner ? 'W' : 'L'}
		</p>
	);
}
