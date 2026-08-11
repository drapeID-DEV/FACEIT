import Image from 'next/image';

import type { ILeaderboardPlayer } from '@/shared/types/api/responses';
import Link from 'next/link';

interface Props {
	player: ILeaderboardPlayer;
}

export function LeaderboardRow({ player }: Props) {
	return (
		<Link
			href={`/players/${player.nickname}`}
			className="grid grid-cols-[80px_1fr_120px] items-center border-b border-neutral-800 px-6 py-4 hover:bg-accent duration-200"
		>
			<span className="text-sm font-bold">{player.rank}</span>
			<div className="flex items-center gap-4">
				<div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-800">
					{player.profilePic && (
						<Image
							src={player.profilePic}
							alt={player.nickname}
							fill
							className="object-cover"
						/>
					)}
				</div>
				<span className="font-medium">{player.nickname}</span>
			</div>
			<span className="text-right font-semibold">{player.elo}</span>
		</Link>
	);
}
