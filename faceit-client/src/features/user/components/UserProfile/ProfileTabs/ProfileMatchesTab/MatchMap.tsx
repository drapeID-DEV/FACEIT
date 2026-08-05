interface Props {
	mapName: string;
}

export function MatchMap({ mapName }: Props) {
	return <div>{mapName.replace('de_', '').toUpperCase()}</div>;
}
