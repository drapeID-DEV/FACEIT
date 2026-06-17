'use client';

import '../globals.css';
import { LeftSidebar } from '@/features/menu-system/components/LeftSidebar';
import { RightSidebar } from '@/features/menu-system/components/RightSidebar';
import { PopupMenu } from '@/features/popups/components/PopupMenu';
import { useGetMeQuery } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MainLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const { isLoading, isFetching, error } = useGetMeQuery();
	const router = useRouter();

	// useEffect(() => {
	// 	if (error) {
	// 		router.replace('/auth/login');
	// 	}
	// }, [error]);

	// if (isLoading || isFetching) return null;

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
