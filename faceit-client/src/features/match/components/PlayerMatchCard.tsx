import { ProfileMatchPic } from '@/shared/components/ui/ProfileMatchCard';
import { IMatchParticipant } from '@/shared/types/match';
import Link from 'next/link';
import { PlayerStatsGrid } from '../../stats/PlayerStatsGrid';

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
						<div className="flex gap-2 items-center">
							<svg
								viewBox="0 0 24 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								color="secondary"
								height="16"
								width="16"
							>
								<title>Elo</title>
								<path
									d="M12 3c0 .463-.105.902-.292 1.293l1.998 2A2.97 2.97 0 0115 6a2.99 2.99 0 011.454.375l1.921-1.921a3 3 0 111.5 1.328l-2.093 2.093a3 3 0 11-5.49-.168l-1.999-2a2.992 2.992 0 01-2.418.074L5.782 7.876a3 3 0 11-1.328-1.5l1.921-1.921A3 3 0 1112 3z"
									fill="currentColor"
								></path>
							</svg>
							<p className="text-widget">{player.user.elo}</p>
						</div>
					</div>
				</div>
			</Link>
			<div className="flex px-3 justify-between text-white py-2 text-xl">
				<PlayerStatsGrid
					items={['matches', 'winRate', 'avg', 'kd']}
					playerStats={player.user.playerStats}
				/>
			</div>
		</div>
	);
}
