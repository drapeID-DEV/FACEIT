import { MatchmakingContent } from '@/features/matchmaking/components/MatchmakingContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Matchmaking',
	description: 'Start matchmaking on FACEIT'
};

export default function MatchmakingPage() {
	return <MatchmakingContent />;
}
