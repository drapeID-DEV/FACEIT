import { UserProfile } from '@/features/user/components/UserProfile';
import type { Metadata } from 'next';

interface Props {
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

export default async function PlayerProfilePage({ params }: Props) {
	const { nickname } = await params;

	return (
		<div className="px-25 py-5">
			<UserProfile nickname={nickname} />
		</div>
	);
}
