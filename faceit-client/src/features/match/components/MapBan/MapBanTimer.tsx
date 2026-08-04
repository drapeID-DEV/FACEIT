'use client';

import { useEffect, useState } from 'react';

interface Props {
	deadline: string;
}

export function MapBanTimer({ deadline }: Props) {
	const getTime = () =>
		Math.max(
			0,
			Math.ceil((new Date(deadline).getTime() - Date.now()) / 1000)
		);

	const [seconds, setSeconds] = useState(getTime);

	useEffect(() => {
		setSeconds(getTime());

		const interval = setInterval(() => {
			setSeconds(getTime());
		}, 1000);

		return () => clearInterval(interval);
	}, [deadline]);

	return (
		<div className="flex flex-col items-center gap-2">
			<p className="text-sm uppercase tracking-widest text-zinc-500">
				Time left
			</p>
			<div
				className={`flex h-20 w-20 items-center justify-center rounded-full border-4 text-3xl font-bold transition-colors ${
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
