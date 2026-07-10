import { ProfileMatchPic } from '@/shared/components/ui/ProfileMatchCard';
import { IMatchParticipant } from '@/shared/types/match';
import Link from 'next/link';
import { CardStatsList } from './CardStatsList';

interface Props {
	player: IMatchParticipant;
}

export function PlayerMatchCard({ player }: Props) {
	return (
		<div className="h-max border border-accent rounded-xl">
			<Link href={`/players/${player.user.nickname}`}>
				<div className="flex items-center text-sm hover:bg-accent duration-200 border border-accent rounded-xl">
					<ProfileMatchPic profilePic={player.user.profilePic} />
					<div className="px-3 flex items-center justify-between w-full text-[20px]">
						<p className="font-bold">{player.user.nickname}</p>
						<p className="text-widget">{player.user.elo}</p>
					</div>
				</div>
			</Link>
			<div className="flex px-3 justify-between text-white py-2 text-xl">
				<CardStatsList playerId={player.userId} />
			</div>
		</div>
	);
}
