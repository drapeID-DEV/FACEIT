'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LoaderCircle } from 'lucide-react';

import { ServerInfo } from '../hooks/useMatchSocket';

interface Props {
	map: string;
	isParticipiant: boolean;
	serverInfo: ServerInfo | null;
}

export function SelectedMapScreen({ map, isParticipiant, serverInfo }: Props) {
	const [copied, setCopied] = useState(false);

	const serverAddress =
		serverInfo?.status === 'READY' ? serverInfo.address : null;

	const handleCopy = async () => {
		if (!serverAddress) return;

		try {
			await navigator.clipboard.writeText(serverAddress);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

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
			{isParticipiant && (
				<div className="flex min-h-16 max-w-[700px] items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
					{serverAddress ? (
						<>
							<span className="select-all break-all font-mono text-lg text-white">
								{serverAddress}
							</span>
							<button
								type="button"
								onClick={handleCopy}
								aria-label="Copy server address"
								className="h-10 shrink-0 rounded-lg bg-[#ff7a00] px-5 text-sm font-semibold uppercase text-white transition hover:bg-orange-600"
							>
								{copied ? 'Copied' : 'Copy'}
							</button>
						</>
					) : serverInfo?.status === 'FAILED' ? (
						<span className="text-red-400">
							Failed to start game server
							{serverInfo.error ? `: ${serverInfo.error}` : ''}
						</span>
					) : (
						<div className="flex items-center gap-3 text-zinc-400">
							<LoaderCircle className="animate-spin" size={22} />
							<span>Server is starting...</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
