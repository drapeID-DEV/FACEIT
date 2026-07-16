import { MatchesList } from '@/features/user/components/UserProfile/ProfileMatchesTab/MatchesList';

interface PageProps {
	params: Promise<{
		nickname: string;
	}>;
}

export default async function MatchesPage({ params }: PageProps) {
	const { nickname } = await params;
	return <MatchesList nickname={nickname} />;
}
