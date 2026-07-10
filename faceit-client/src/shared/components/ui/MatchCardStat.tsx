interface Props {
	title: string;
	value?: number;
}

export function MatchCardStat({ title, value }: Props) {
	return (
		<div className="flex flex-col text-[12px] items-center gap-1">
			<p>{value}</p>
			<p>{title}</p>
		</div>
	);
}
