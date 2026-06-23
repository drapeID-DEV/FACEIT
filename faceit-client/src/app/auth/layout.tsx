import { ToastProvider } from '@/providers/ToastProvider';

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
