'use client';

import { useEffect, useMemo, useState } from 'react';
import { socket } from '@/shared/lib/socket';
import { useGetCurrentAcceptanceQuery } from '@/store/api/matchmakingApi';

export function AcceptanceModal() {
	const { data } = useGetCurrentAcceptanceQuery(undefined, {
		pollingInterval: 1000
	});

	const [timeLeft, setTimeLeft] = useState(0);
	const [isAccepted, setIsAccepted] = useState(false);

	useEffect(() => {
		if (!data?.hasAcceptance) {
			return;
		}

		setIsAccepted(data.acceptance.hasAccepted);
	}, [data]);

	useEffect(() => {
		if (!data?.hasAcceptance) {
			return;
		}

		const update = () => {
			const seconds = Math.max(
				0,
				Math.ceil(
					(new Date(data.acceptance.expiresAt).getTime() -
						Date.now()) /
						1000
				)
			);

			setTimeLeft(seconds);
		};

		update();

		const interval = setInterval(update, 250);

		return () => clearInterval(interval);
	}, [data]);

	const timer = useMemo(() => {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;

		return `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	}, [timeLeft]);

	if (!data?.hasAcceptance) {
		return null;
	}

	const { acceptanceId, acceptedPlayers, totalPlayers } = data.acceptance;

	const handleAccept = () => {
		if (isAccepted) {
			return;
		}

		socket.emit('acceptMatch', {
			acceptanceId
		});

		setIsAccepted(true);
	};

	return (
		<div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#171717] p-8 shadow-2xl">
				<h2 className="text-center text-3xl font-bold text-white">
					Match Found
				</h2>

				<p className="mt-2 text-center text-sm text-zinc-400">
					Accept the match before time runs out
				</p>

				<div className="mt-8 text-center">
					<div className="text-5xl font-bold text-[#ff7a00]">
						{timer}
					</div>
				</div>

				<div className="mt-8 rounded-xl border border-zinc-800 bg-[#111] p-5">
					<div className="flex items-center justify-between">
						<span className="text-zinc-400">Players ready</span>

						<span className="font-semibold text-white">
							{acceptedPlayers} / {totalPlayers}
						</span>
					</div>

					<div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
						<div
							className="h-full rounded-full bg-[#ff7a00] transition-all duration-300"
							style={{
								width: `${(acceptedPlayers / totalPlayers) * 100}%`
							}}
						/>
					</div>
				</div>

				<button
					onClick={handleAccept}
					disabled={isAccepted}
					className="mt-8 h-12 w-full rounded-lg bg-[#ff7a00] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-zinc-700"
				>
					{isAccepted ? 'Waiting for other players...' : 'Accept'}
				</button>
			</div>
		</div>
	);
}
