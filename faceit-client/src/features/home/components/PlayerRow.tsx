import Link from 'next/link';

import { PlayerAvatar } from '@/shared/components/ui/PlayerAvatar';
import { IPartyUser } from '@/shared/types/party';

interface Props {
	player: IPartyUser;
	rank?: number;
}

export function PlayerRow({ player, rank }: Props) {
	return (
		<Link
			href={`/players/${player.nickname}`}
			className="flex items-center gap-3 rounded-xl bg-accent p-3 duration-200 hover:bg-neutral-700"
		>
			{rank && (
				<span className="w-5 text-center text-sm font-bold text-neutral-400">
					{rank}
				</span>
			)}
			<PlayerAvatar
				nickname={player.nickname}
				profilePic={player.profilePic}
				className="h-9 w-9"
			/>
			<span className="min-w-0 flex-1 truncate font-medium">
				{player.nickname}
			</span>
			<span className="text-sm font-semibold text-widget">
				{player.elo}
			</span>
		</Link>
	);
}
