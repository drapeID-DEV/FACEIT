'use client';

import { useEffect, useState } from 'react';

interface Props {
	joinedAt: string;
}

export function QueueTimer({ joinedAt }: Props) {
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const started = new Date(joinedAt).getTime();

		const interval = setInterval(() => {
			setSeconds(Math.floor((Date.now() - started) / 1000));
		}, 1000);

		return () => clearInterval(interval);
	}, [joinedAt]);

	const minutes = Math.floor(seconds / 60);

	return (
		<p className="h-max">
			{minutes}:{String(seconds % 60).padStart(2, '0')}
		</p>
	);
}
