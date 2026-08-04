'use client';

import clsx from 'clsx';
import Image from 'next/image';

interface Props {
	map: string;
	isAvailable: boolean;
	isMyTurn: boolean;
	onBan(): void;
}

export function MapCard({ map, isAvailable, isMyTurn, onBan }: Props) {
	return (
		<div
			className={clsx(
				'flex text-sm items-center gap-4 rounded-xl border border-zinc-800 bg-accent px-3 py-2 transition',
				!isAvailable && 'opacity-50'
			)}
		>
			<div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md">
				<Image
					src={`/maps/${map}.webp`}
					alt={map}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex-1">
				<p className="font-semibold text-white">
					{map.replace('de_', '').toUpperCase()}
				</p>
			</div>
			{isAvailable ? (
				isMyTurn && (
					<button
						onClick={onBan}
						className="rounded-md border border-widget bg-widget px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
					>
						BAN
					</button>
				)
			) : (
				<span className="rounded-md border border-red-500 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-red-500">
					BANNED
				</span>
			)}
		</div>
	);
}
