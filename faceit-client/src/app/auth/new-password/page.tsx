import { NewPasswordForm } from '@/features/auth/components/NewPasswordForm';
import { Loader } from '@/shared/components/ui/Loader';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'New Password',
	description: 'Create a new password for your FACEIT account'
};

export default function NewPasswordPage() {
	return (
		<Suspense fallback={<Loader />}>
			<NewPasswordForm />
		</Suspense>
	);
}
