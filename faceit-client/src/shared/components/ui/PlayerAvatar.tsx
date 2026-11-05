import Image from 'next/image';
import clsx from 'clsx';

interface Props {
	nickname: string;
	profilePic?: string | null;
	className?: string;
}

export function PlayerAvatar({
	nickname,
	profilePic,
	className = 'h-10 w-10'
}: Props) {
	return (
		<div
			className={clsx(
				'relative shrink-0 overflow-hidden rounded-full bg-neutral-800',
				className
			)}
		>
			{profilePic ? (
				<Image
					src={profilePic}
					alt={nickname}
					fill
					sizes="128px"
					className="object-cover"
				/>
			) : (
				<span className="flex h-full w-full items-center justify-center font-bold uppercase text-neutral-400">
					{nickname.charAt(0)}
				</span>
			)}
		</div>
	);
}
