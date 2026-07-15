import { StatsTab } from '@/features/user/components/UserProfile/ProfileTabs/StatsTab';

interface PageProps {
	params: Promise<{
		nickname: string;
	}>;
}

export default async function StatsPage({ params }: PageProps) {
	const { nickname } = await params;

	return <StatsTab nickname={nickname} />;
}
