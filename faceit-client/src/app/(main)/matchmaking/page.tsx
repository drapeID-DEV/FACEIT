import { Metadata } from 'next';

interface Props {}

export const metadata: Metadata = {
	title: 'Matchmaking',
	description: 'Start matchmaking on FACEIT'
};

export default function page({}: Props) {
	return <div>Matches</div>;
}
