import { MatchContent } from '@/features/match/components/MatchContent';
import type { Metadata } from 'next';

interface Props {
	params: Promise<{ matchId: string }>;
}

export const metadata: Metadata = {
	title: 'Match page',
	description: 'FACEIT match page'
};

export default async function MatchPage({ params }: Props) {
	const { matchId } = await params;

	return (
		<div className="px-25 py-5 w-full h-full">
			<MatchContent matchId={matchId} />
		</div>
	);
}
