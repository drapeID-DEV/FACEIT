import { AccountSettingsForm } from '@/features/user/components/AccountSettingsForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Account Settings',
	description: 'FACEIT account settings'
};

export default function AccountSettingsPage() {
	return (
		<div className="px-25 py-5">
			<AccountSettingsForm />
		</div>
	);
}
