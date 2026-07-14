interface Props {
	title: string;
	value?: number;
	isCard?: boolean;
}

export function PlayerStat({ title, value, isCard }: Props) {
	const styles = isCard
		? 'flex flex-col text-[16px] items-center gap-2 p-4 border border-accent'
		: 'flex flex-col text-[12px] items-center gap-1';

	return (
		<div className={styles}>
			<p>{value}</p>
			<p>{title}</p>
		</div>
	);
}
