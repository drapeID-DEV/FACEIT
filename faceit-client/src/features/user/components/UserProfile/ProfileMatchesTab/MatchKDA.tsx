interface Props {
	kills: number;
	deaths: number;
	assists: number;
}

export function MatchKDA({ kills, deaths, assists }: Props) {
	const kd = deaths === 0 ? kills : +(kills / deaths).toFixed(2);

	return (
		<div className="flex flex-col">
			<p className="font-semibold">
				{kills} / {deaths} / {assists}
			</p>

			<p className="text-sm text-neutral-400">K/D {kd}</p>
		</div>
	);
}
