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
			<div className="relative rounded-2xl bg-neutral-950 h-full w-full box-border flex text-5xl overflow-auto">
				{children}
				<PopupMenu />
			</div>
			<RightSidebar />
		</SocketProvider>
	);
}
