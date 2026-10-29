'use client';

import { useEffect, useState } from 'react';

interface Props {
	deadline: string;
}

// Remount with `key={deadline}` to restart for a new turn
export function MapBanTimer({ deadline }: Props) {
	const getTime = () =>
		Math.max(
			0,
			Math.ceil((new Date(deadline).getTime() - Date.now()) / 1000)
		);

	const [seconds, setSeconds] = useState(getTime);

	useEffect(() => {
		const interval = setInterval(() => {
			setSeconds(getTime());
		}, 1000);

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deadline]);

	return (
		<div className="flex items-center gap-3">
			<p className="text-xs uppercase tracking-widest text-zinc-500">
				Time left
			</p>
			<div
				className={`flex h-14 w-14 items-center justify-center rounded-full border-4 text-2xl font-bold transition-colors ${
					seconds <= 5
						? 'border-red-500 text-red-500'
						: 'border-widget text-widget'
				}`}
			>
				{seconds}
			</div>
		</div>
	);
}
