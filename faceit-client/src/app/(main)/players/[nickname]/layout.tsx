import type { Metadata } from 'next';
import { UserProfile } from '@/features/user/components/UserProfile';
import { ProfileTabsControl } from '@/features/user/components/UserProfile/ProfileTabsControl';

interface Props {
	children: React.ReactNode;
	params: Promise<{
		nickname: string;
	}>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { nickname } = await params;

	return {
		title: nickname,
		description: `Public FACEIT profile of the player ${nickname}`
	};
}

export default async function Layout({ children, params }: Props) {
	const { nickname } = await params;

	return (
		<div className="flex w-full gap-10 px-25 py-5">
			<aside className="w-80 shrink-0">
				<UserProfile nickname={nickname} />
			</aside>
			<div className="flex flex-1 flex-col gap-10">
				<ProfileTabsControl nickname={nickname} />
				{children}
			</div>
		</div>
	);
}
