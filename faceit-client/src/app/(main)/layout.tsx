'use client';
import '../globals.css';
import { LeftSidebar } from '@/features/menu-system/components/LeftSidebar';
import { RightSidebar } from '@/features/menu-system/components/RightSidebar';
import { PopupMenu } from '@/features/popups/components/PopupMenu';
import { SocketProvider } from '@/providers/SocketProvider';
import { Loader } from '@/shared/components/ui/Loader';
import { useGetMeQuery } from '@/store/api/userApi';
import { useRouter } from 'next/navigation';

export default function MainLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();

	//check if the session is still active(can be removed manually from the redis)
	//if the request throws 401 status, the server side will remove session cookie
	const { isLoading, isError } = useGetMeQuery();

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		router.push('/auth/login');
	}

	return (
		!isError && (
			<SocketProvider>
				<LeftSidebar />
				<div className="relative rounded-2xl bg-neutral-950 h-full w-full box-border flex text-5xl overflow-auto">
					{children}
					<PopupMenu />
				</div>
				<RightSidebar />
			</SocketProvider>
		)
	);
}
