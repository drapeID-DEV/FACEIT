import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Reset Password',
	description: 'Reset your FACEIT account password'
};

export default function ResetPasswordPage() {
	return <ResetPasswordForm />;
}
