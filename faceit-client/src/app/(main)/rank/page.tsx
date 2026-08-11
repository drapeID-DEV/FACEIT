import { Leaderboard } from '@/features/leaderboard/components/Leaderboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Leaderboard',
	description: 'Global FACEIT ranking, players leaderboard'
};

export default async function LeaderboardPage() {
	return <Leaderboard />;
}
