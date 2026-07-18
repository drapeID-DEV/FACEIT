import { IMatchHistoryItem } from '../types/match-history';

export function getEnemyTeamName(match: IMatchHistoryItem) {
	const me = match.match.participants.find((p) => p.user.id === match.userId);

	if (!me) return 'Unknown';

	const enemy = match.match.participants.find((p) => p.team !== me.team);

	return enemy ? `team_${enemy.user.nickname}` : 'Unknown';
}
