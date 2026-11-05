import EmailVerificationForm from '@/features/auth/components/EmailVerificationFrom';
import { Loader } from '@/shared/components/ui/Loader';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Email Verification'
};

export default function NewVerificationPage() {
	return (
		<Suspense fallback={<Loader />}>
			<EmailVerificationForm />
		</Suspense>
	);
}
