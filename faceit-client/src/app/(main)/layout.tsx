import '../globals.css';
import { LeftSidebar } from '@/features/menu-system/components/LeftSidebar';
import { RightSidebar } from '@/features/menu-system/components/RightSidebar';
import { PopupMenu } from '@/features/popups/components/PopupMenu';

export default function MainLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<LeftSidebar />
			<div className="relative rounded-2xl bg-neutral-950 h-full w-full box-border flex items-center justify-center text-5xl">
				{children}
				<PopupMenu />
			</div>
			<RightSidebar />
		</>
	);
}
