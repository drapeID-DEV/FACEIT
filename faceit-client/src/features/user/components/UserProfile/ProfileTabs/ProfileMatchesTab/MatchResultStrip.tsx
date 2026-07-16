interface Props {
	isWinner: boolean;
}

export function MatchResultStrip({ isWinner }: Props) {
	const styles = `'w-1 rounded-full' ${isWinner ? 'bg-green-500' : 'bg-red-500'}`;
	return <div className={styles} />;
}
