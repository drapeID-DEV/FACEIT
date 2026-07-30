import { MatchResultBadge } from '@/shared/components/ui/MatchResultBadge';
import TooltipRow from './TooltipRow';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IEloHistoryItem } from '@/shared/types/api/responses';

interface MatchTooltipProps {
	match: IEloHistoryItem;
}

export function MatchTooltip({ match }: MatchTooltipProps) {
	const eloChange = match.eloAfter - match.eloBefore;

	return (
		<div className="w-[170px] rounded-xl border border-accent bg-primary p-5 shadow-2xl">
			<p className="mb-5 text-xs font-medium text-zinc-500">
				{new Date(match.createdAt).toLocaleString()}
			</p>
			<div className="mb-6 flex items-center gap-3">
				<MatchResultBadge isWinner={match.isWinner} />
				<p className="text-2xl font-bold tracking-wide text-white">
					{match.match.team1Score} : {match.match.team2Score}
				</p>
			</div>
			<div className="flex flex-col">
				<TooltipRow
					label="K/D/A"
					value={`${match.kills}/${match.deaths}/${match.assists}`}
				/>
				<TooltipRow label="ELO" value={match.eloAfter} />
				<TooltipRow
					label="ELO change"
					value={
						<div className="flex flex-col items-center">
							<div
								className={`flex items-center text-sm font-semibold ${
									eloChange > 0
										? 'text-green-500'
										: 'text-red-500'
								}`}
							>
								{eloChange > 0 ? (
									<ChevronUp size={16} />
								) : (
									<ChevronDown size={16} />
								)}
								{Math.abs(eloChange)}
							</div>
						</div>
					}
				/>
			</div>
		</div>
	);
}
