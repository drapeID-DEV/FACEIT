import Image from 'next/image';

interface Props {
	profilePic?: string;
}

export function ProfileMatchPic({ profilePic }: Props) {
	return (
		<div className="h-full px-2 py-4 bg-accent rounded-xl">
			{profilePic && (
				<Image
					src={profilePic}
					alt={`avatar`}
					width={50}
					height={50}
					className="rounded-full"
				/>
			)}
		</div>
	);
}
