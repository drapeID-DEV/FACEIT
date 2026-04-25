import { USERS } from '@/shared/data/users.data'
import { PopupMatchCard } from './PopupMatchCard'

export function PopupMatchesList() {
	return (
		<ul className="flex flex-col gap-3 px-5 mb-3 overflow-y-auto">
			{USERS['u1'].matchIds.map((match) => (
				<PopupMatchCard key={match} matchId={match} />
			))}
		</ul>
	)
}
