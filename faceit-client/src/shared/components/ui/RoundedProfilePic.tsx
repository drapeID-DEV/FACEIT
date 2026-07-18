import Image from 'next/image';

interface Props {
	picture: string;
}

export function RoundedProfilePic({ picture }: Props) {
	return (
		<Image
			src={picture}
			alt={`avatar`}
			width={50}
			height={50}
			className="rounded-full"
		/>
	);
}
