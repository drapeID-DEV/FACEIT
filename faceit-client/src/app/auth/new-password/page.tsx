import { NewPasswordForm } from '@/features/auth/components/NewPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'New Password',
	description: 'Create a new password for your FACEIT account'
};

export default function NewPasswordPage() {
	return <NewPasswordForm />;
}
