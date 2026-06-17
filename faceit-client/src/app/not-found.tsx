import { LeftSidebar } from '@/features/menu-system/components/LeftSidebar';
import { RightSidebar } from '@/features/menu-system/components/RightSidebar';
import { PopupMenu } from '@/features/popups/components/PopupMenu';

export default function NotFound() {
	return (
		<>
			<LeftSidebar />

			<div className="relative rounded-2xl bg-neutral-950 h-full w-full flex items-center justify-center">
				<div className="text-center text-8xl">
					<h1>404</h1>
					<p className="text-4xl">Page not found</p>
				</div>
				<PopupMenu />
			</div>

			<RightSidebar />
		</>
	);
}
