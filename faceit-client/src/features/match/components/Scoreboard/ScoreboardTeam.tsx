import Link from 'next/link';

import { RoundedProfilePic } from '@/shared/components/ui/RoundedProfilePic';
import { IMatchParticipant, TSide } from '@/shared/types/match';

interface Props {
	name: string;
	score: number;
	players: IMatchParticipant[];
	side: TSide | null;
	isWinner: boolean;
}

const SIDE_STYLES: Record<TSide, { bar: string; label: string }> = {
	CT: { bar: 'bg-sky-500', label: 'CT' },
	TERRORIST: { bar: 'bg-amber-500', label: 'T' }
};

const COLUMNS = ['K', 'A', 'D', '+/-', 'HS%', 'K/D'];

export function ScoreboardTeam({ name, score, players, side, isWinner }: Props) {
	const sorted = [...players].sort(
		(a, b) => b.kills - a.kills || a.deaths - b.deaths
	);

	return (
		<div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
			<div className="flex items-center gap-3 bg-white/5 px-4 py-3">
				<span
					className={`h-6 w-1 rounded-full ${side ? SIDE_STYLES[side].bar : 'bg-zinc-600'}`}
				/>
				<span className="flex-1 truncate text-lg font-bold text-white">
					{name}
					{side && (
						<span className="ml-2 text-xs font-semibold text-zinc-400">
							{SIDE_STYLES[side].label}
						</span>
					)}
				</span>
				<span
					className={`font-mono text-2xl font-black ${isWinner ? 'text-widget' : 'text-white'}`}
				>
					{score}
				</span>
			</div>
			<table className="w-full text-sm">
				<thead>
					<tr className="text-xs uppercase tracking-wider text-zinc-500">
						<th className="px-4 py-2 text-left font-semibold">Player</th>
						{COLUMNS.map((column) => (
							<th key={column} className="w-16 px-2 py-2 text-center font-semibold">
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{sorted.length === 0 && (
						<tr>
							<td colSpan={COLUMNS.length + 1} className="px-4 py-4 text-center text-zinc-500">
								No players
							</td>
						</tr>
					)}
					{sorted.map((player) => {
						const diff = player.kills - player.deaths;
						const hs = player.kills
							? Math.round((player.headshots / player.kills) * 100)
							: 0;
						const kd = player.deaths
							? (player.kills / player.deaths).toFixed(2)
							: player.kills.toFixed(2);

						return (
							<tr
								key={player.id}
								className="border-t border-white/5 font-mono text-white odd:bg-white/[0.02]"
							>
								<td className="px-4 py-2 font-sans">
									<Link
										href={`/players/${player.user.nickname}`}
										className="flex items-center gap-3 hover:text-widget"
									>
										{player.user.profilePic ? (
											<RoundedProfilePic picture={player.user.profilePic} />
										) : (
											<div className="h-[39px] w-[39px] rounded-full bg-widget" />
										)}
										<span className="truncate font-semibold">
											{player.user.nickname}
										</span>
									</Link>
								</td>
								<td className="px-2 text-center">{player.kills}</td>
								<td className="px-2 text-center">{player.assists}</td>
								<td className="px-2 text-center">{player.deaths}</td>
								<td
									className={`px-2 text-center ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-zinc-400'}`}
								>
									{diff > 0 ? `+${diff}` : diff}
								</td>
								<td className="px-2 text-center">{hs}%</td>
								<td className="px-2 text-center">{kd}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
