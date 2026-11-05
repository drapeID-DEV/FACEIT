'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Info, Swords, Users } from 'lucide-react';

import { RecentMatches } from '@/features/home/components/RecentMatches';
import { TopPlayers } from '@/features/home/components/TopPlayers';
import { PartySlots } from '@/features/party/components/PartySlots';
import { TMatchType } from '@/shared/types/match';
import {
	useGetCurrentMatchQuery,
	useGetMatchmakingConfigQuery,
	useGetQueueStatusQuery
} from '@/store/api/matchmakingApi';
import { useGetPartyQuery } from '@/store/api/partyApi';

import { PlayerSummary } from './PlayerSummary';
import { QueueControlBtn } from './QueueControlBtn';

const QUEUE_REFRESH_INTERVAL = 5_000;

export function MatchmakingContent() {
	const [selectedType, setSelectedType] = useState<TMatchType>('ONE_VS_ONE');

	const { data: config } = useGetMatchmakingConfigQuery();
	const { data: partyState } = useGetPartyQuery();
	const { data: currentMatch } = useGetCurrentMatchQuery();
	const { data: queue } = useGetQueueStatusQuery(undefined, {
		pollingInterval: QUEUE_REFRESH_INTERVAL
	});

	const teamSize = config?.teamSize ?? 5;
	const teamLabel = `${teamSize}v${teamSize}`;
	const inParty = (partyState?.party?.members.length ?? 0) > 1;
	const inQueue = !!queue?.inQueue;

	// A party cannot fit in 1v1, and a queued player stays in the mode they queued for
	const matchType: TMatchType = inQueue
		? queue.matchType
		: inParty
			? 'TEAM'
			: selectedType;

	const modes = [
		{
			type: 'ONE_VS_ONE' as const,
			label: '1v1',
			icon: Swords,
			needed: 2,
			description:
				'Solo duel against a player within 100 ELO of you. Parties cannot join this mode.'
		},
		{
			type: 'TEAM' as const,
			label: teamLabel,
			icon: Users,
			needed: teamSize * 2,
			description: `Two teams of ${teamSize}, built from parties and solo players within 300 ELO. Parties always stay on one team.`
		}
	];

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
			<PlayerSummary />

			<section
				aria-label="Match type"
				className="grid grid-cols-1 gap-3 md:grid-cols-2"
			>
				{modes.map((mode) => {
					const isDisabled =
						inQueue || (mode.type === 'ONE_VS_ONE' && inParty);

					return (
						<button
							key={mode.type}
							type="button"
							disabled={isDisabled}
							aria-pressed={matchType === mode.type}
							onClick={() => setSelectedType(mode.type)}
							className={clsx(
								'flex flex-col gap-2 rounded-2xl border-2 bg-primary p-5 text-left duration-200',
								matchType === mode.type
									? 'border-widget'
									: 'border-transparent enabled:hover:bg-accent',
								isDisabled &&
									matchType !== mode.type &&
									'cursor-not-allowed opacity-50'
							)}
						>
							<span className="flex items-center justify-between">
								<span className="flex items-center gap-2 text-xl font-bold">
									<mode.icon size={20} />
									{mode.label}
								</span>
								<span className="text-xs text-neutral-400">
									{queue?.searching?.[mode.type] ?? 0}/
									{mode.needed} searching
								</span>
							</span>
							<span className="text-sm text-neutral-400">
								{mode.description}
							</span>
						</button>
					);
				})}
			</section>

			{inParty && (
				<p className="text-sm text-neutral-400">
					1v1 is off while you are in a party. Leave the party to play
					it.
				</p>
			)}

			{(matchType === 'TEAM' || inParty) && (
				<PartySlots
					teamSize={teamSize}
					isLocked={inQueue || !!currentMatch?.hasActiveMatch}
				/>
			)}

			<section className="flex flex-col items-center gap-3 rounded-2xl bg-primary p-6">
				<QueueControlBtn matchType={matchType} />
			</section>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
				<RecentMatches />
				<TopPlayers />
			</div>

			<p className="flex items-start gap-2 text-xs text-neutral-500">
				<Info size={14} className="mt-0.5 shrink-0" />
				The game server hosts one match at a time. Inside CS2, players
				join their assigned side themselves.
			</p>
		</div>
	);
}
