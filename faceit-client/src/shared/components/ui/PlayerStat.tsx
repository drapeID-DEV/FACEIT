interface Props {
	title: string;
	decimals?: number;
	value?: number;
	variant?: 'default' | 'card';
}

export function PlayerStat({ title, value, variant, decimals }: Props) {
	const styles =
		variant === 'card'
			? 'flex flex-col text-[20px] items-center gap-2 py-4 min-w-30 rounded-xl border border-accent basis-[calc((100%-5rem)/3)] bg-primary'
			: 'flex flex-col text-[12px] items-center gap-1';

	return (
		<div className={styles}>
			<p>{decimals !== undefined ? value?.toFixed(decimals) : value}</p>
			<p>{title}</p>
		</div>
	);
}
