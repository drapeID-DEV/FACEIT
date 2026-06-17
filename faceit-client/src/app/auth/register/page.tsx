import { RegisterForm } from '@/features/auth/components/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Register',
	description: 'Register on FACEIT'
};

export default function Register() {
	return <RegisterForm />;
}
