import { AccountSettingsForm } from '@/features/user/components/AccountSettingsForm';
import { AvatarUploader } from '@/features/user/components/AvatarUploader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Account Settings',
	description: 'FACEIT account settings'
};

export default function AccountSettingsPage() {
	return (
		<div className="px-25 py-5 flex gap-20 h-max flex-wrap items-center">
			<AccountSettingsForm />
			<AvatarUploader />
		</div>
	);
}
