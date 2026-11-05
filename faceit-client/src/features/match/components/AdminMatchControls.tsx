'use client';

import { useState } from 'react';

import { TApiError } from '@/shared/types/api/responses';
import { IMatch } from '@/shared/types/match';
import { notification } from '@/shared/utils/notifications';
import { useCancelMatchMutation } from '@/store/api/matchApi';

import { FinishMatchForm } from './FinishMatchForm';

interface Props {
	match: IMatch;
	team1Name: string;
	team2Name: string;
}

export function AdminMatchControls({ match, team1Name, team2Name }: Props) {
	const [isFinishing, setIsFinishing] = useState(false);
	const [cancelMatch, { isLoading }] = useCancelMatchMutation();

	if (match.status === 'FINISHED' || match.status === 'CANCELLED') {
		return null;
	}

	const handleCancel = async () => {
		if (!window.confirm('Cancel this match?')) {
			return;
		}

		try {
			await cancelMatch(match.id).unwrap();
			notification.info('Match cancelled!');
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<div className="flex items-center gap-3 py-3 text-sm">
			<span className="text-neutral-400">Admin</span>
			{match.status === 'LIVE' && (
				<button
					type="button"
					onClick={() => setIsFinishing(true)}
					className="rounded-md bg-widget px-4 py-2 duration-200 hover:bg-amber-900"
				>
					Finish match
				</button>
			)}
			<button
				type="button"
				onClick={handleCancel}
				disabled={isLoading}
				className="rounded-md border border-accent px-4 py-2 text-red-500 duration-200 hover:bg-accent disabled:opacity-50"
			>
				Cancel match
			</button>
			{isFinishing && (
				<FinishMatchForm
					match={match}
					team1Name={team1Name}
					team2Name={team2Name}
					onClose={() => setIsFinishing(false)}
				/>
			)}
		</div>
	);
}
