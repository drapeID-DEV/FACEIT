import { EloStatistics } from '@/features/user/components/UserProfile/ProfileTabs/OverviewTab/EloStatistics/EloStatistics';

interface PageProps {
	params: Promise<{
		nickname: string;
	}>;
}

export default async function PlayerProfilePage({ params }: PageProps) {
	const { nickname } = await params;

	return <EloStatistics nickname={nickname} />;
}
