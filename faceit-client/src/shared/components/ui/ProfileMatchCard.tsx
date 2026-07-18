import { RoundedProfilePic } from './RoundedProfilePic';

interface Props {
	profilePic?: string;
}

export function ProfileMatchPic({ profilePic }: Props) {
	return (
		<div className="h-full px-2 py-4 bg-accent rounded-xl">
			{profilePic ? (
				<RoundedProfilePic picture={profilePic} />
			) : (
				<div className="w-[39px] h-[39px] rounded-full bg-widget"></div>
			)}
		</div>
	);
}
