import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from '@/providers/ToastProvider';

const roboto = Roboto({
	variable: '--font-roboto',
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: {
		absolute: 'FACEIT',
		template: '%s - FACEIT'
	},
	description: 'Cybersport platform for CS2'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${roboto.variable} h-full antialiased`}>
			<body className="h-screen flex py-2 justify-center items-center">
				<ReduxProvider>
					{children}
					<ToastProvider />
				</ReduxProvider>
			</body>
		</html>
	);
}
