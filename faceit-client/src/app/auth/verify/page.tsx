import EmailVerificationForm from '@/features/auth/components/EmailVerificationFrom';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Email Verification'
};

export default function NewVerificationPage() {
	return <EmailVerificationForm />;
}
