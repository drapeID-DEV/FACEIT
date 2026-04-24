import { MATCHES } from '@/shared/data/matches.data'
import { USERS } from '@/shared/data/users.data'
import { IMatch, MatchID } from '@/shared/types/match'

interface Props {
	matchId: MatchID
}

export function PopupMatchCard({ matchId }: Props) {
	const matchData = MATCHES[matchId]
	const teamName = USERS[matchData.teams.team2[0]].username

	return (
		<div className="bg-neutral-800 p-3 flex justify-between w-full rounded-xl">
			<p className="text-base">team_{teamName}</p>
			<p
				className={`text-base ${matchData.result === 'Win' ? 'text-green-600' : 'text-red-600'}`}
			>
				{matchData.result}
			</p>
		</div>
	)
}
