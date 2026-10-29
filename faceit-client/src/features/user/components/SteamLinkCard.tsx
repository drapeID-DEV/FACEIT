'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { notification } from '@/shared/utils/notifications';
import { useGetMeQuery, useUnlinkSteamMutation } from '@/store/api/userApi';

// Result of the Steam sign-in redirect, set by GET /users/steam/callback
const STEAM_RESULTS: Record<
	string,
	{ type: 'info' | 'error'; message: string }
> = {
	linked: { type: 'info', message: 'Steam account linked!' },
	taken: {
		type: 'error',
		message: 'This Steam account is already linked to another profile.'
	},
	failed: { type: 'error', message: 'Steam sign-in could not be verified.' }
};

export function SteamLinkCard() {
	const router = useRouter();
	const pathname = usePathname();
	const { data: me } = useGetMeQuery();
	const [unlink, { isLoading: isUnlinking }] = useUnlinkSteamMutation();

	useEffect(() => {
		const result = new URLSearchParams(window.location.search).get('steam');
		const toast = result ? STEAM_RESULTS[result] : undefined;

		if (!toast) return;

		notification[toast.type](toast.message);
		router.replace(pathname);
	}, [pathname, router]);

	const handleUnlink = async () => {
		try {
			await unlink().unwrap();
			notification.info('Steam account unlinked');
		} catch {
			notification.error('Could not unlink Steam account');
		}
	};

	return (
		<div className="w-full max-w-md space-y-3 rounded-xl border border-white/10 bg-accent p-5 text-sm">
			<div>
				<h3 className="text-lg font-bold text-white">Steam account</h3>
				<p className="text-zinc-400">
					Required for live CS2 match stats. Linked through Steam
					sign-in, so only the account owner can link it.
				</p>
			</div>
			{me?.steamId ? (
				<div className="flex items-center justify-between gap-3">
					<a
						href={`https://steamcommunity.com/profiles/${me.steamId}`}
						target="_blank"
						rel="noreferrer"
						className="font-mono text-white hover:text-widget"
					>
						{me.steamId}
					</a>
					<button
						type="button"
						onClick={handleUnlink}
						disabled={isUnlinking}
						className="rounded-md border border-red-500 px-4 py-2 font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
					>
						Unlink
					</button>
				</div>
			) : (
				<a
					href={`${process.env.NEXT_PUBLIC_SERVER_API_URL}/users/steam/link`}
					className="inline-block rounded-md bg-widget px-5 py-2 font-semibold text-white transition hover:bg-[#2a475e]"
				>
					Link Steam account
				</a>
			)}
		</div>
	);
}
