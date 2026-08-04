'use client';

import Image from 'next/image';

interface Props {
	map: string;
}

export function SelectedMapScreen({ map }: Props) {
	return (
		<div className="flex flex-col items-center gap-6">
			<span className="text-sm uppercase tracking-[0.35em] text-zinc-500">
				Selected map
			</span>
			<div className="relative h-80 w-[700px] overflow-hidden rounded-2xl border border-zinc-800">
				<Image
					src={`/maps/${map}.webp`}
					alt={map}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 p-8">
					<p className="text-5xl font-black uppercase text-white">
						{map.replace('de_', '')}
					</p>
				</div>
			</div>
		</div>
	);
}
