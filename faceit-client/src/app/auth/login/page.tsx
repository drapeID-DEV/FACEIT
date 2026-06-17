import { LoginForm } from '@/features/auth/components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Login',
	description: 'Login on FACEIT'
};

export default function Login() {
	return <LoginForm />;
}
