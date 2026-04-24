import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { LeftSidebar } from '@/components/LeftSidebar'
import { RightSidebar } from '@/components/RightSidebar'
import { ReduxProvider } from '@/providers/ReduxProvider'
import { PopupMenu } from '@/components/PopupMenu'

const roboto = Roboto({
	variable: '--font-roboto',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: 'FACEIT',
	description: 'Cybersport platform'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className={`${roboto.variable} h-full antialiased`}>
			<body className="h-screen flex py-2">
				<ReduxProvider>
					<LeftSidebar />
					<div className="relative rounded-2xl bg-neutral-950 h-full w-full box-border flex items-center justify-center text-5xl">
						{children}
						<PopupMenu />
					</div>
					<RightSidebar />
				</ReduxProvider>
			</body>
		</html>
	)
}
