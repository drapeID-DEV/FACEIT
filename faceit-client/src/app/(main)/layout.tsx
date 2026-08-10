import { AcceptanceModal } from '@/features/matchmaking/components/AcceptanceModal';
import '../globals.css';
import { LeftSidebar } from '@/features/menu-system/components/LeftSidebar';
import { RightSidebar } from '@/features/menu-system/components/RightSidebar';
import { PopupMenu } from '@/features/popups/components/PopupMenu';
import { SocketProvider } from '@/providers/SocketProvider';

export default function MainLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<SocketProvider>
			<AcceptanceModal />
			<LeftSidebar />
			<main className="relative flex-1 min-w-0 h-full overflow-hidden rounded-2xl bg-neutral-950">
				<div className="h-full overflow-auto px-25 py-5">
					{children}
				</div>
				<PopupMenu />
			</main>
			<RightSidebar />
		</SocketProvider>
	);
}
