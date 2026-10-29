import { AccountSettingsForm } from '@/features/user/components/AccountSettingsForm';
import { AvatarUploader } from '@/features/user/components/AvatarUploader';
import { SteamLinkCard } from '@/features/user/components/SteamLinkCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Account Settings',
	description: 'FACEIT account settings'
};

export default function AccountSettingsPage() {
	return (
		<div className="flex gap-20 h-max flex-wrap items-center">
			<AccountSettingsForm />
			<AvatarUploader />
			<SteamLinkCard />
		</div>
	);
}
