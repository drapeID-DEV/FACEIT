'use client';

import { useGetMeQuery } from '@/store/api/userApi';
import Image from 'next/image';
import Link from 'next/link';

interface BaseProps {
	onClick?: () => void;
}

interface LinkProps extends BaseProps {
	isLink: true;
	href: string;
}

interface ButtonProps extends BaseProps {
	isLink?: false;
	href?: never;
}

type Props = LinkProps | ButtonProps;

export function AvatarBtn({ onClick, isLink, href }: Props) {
	const { data } = useGetMeQuery();

	const avatar = data?.profilePic ? (
		<Image
			src={data.profilePic}
			alt={`${data.nickname} avatar`}
			fill
			className="w-full h-full object-cover"
		/>
	) : null;

	const className =
		'relative overflow-hidden w-10 h-10 border-2 border-transparent rounded-full hover:cursor-pointer hover:border-neutral-700 ' +
		(data?.profilePic ? '' : 'bg-amber-600');

	return isLink ? (
		<Link href={href} className={className}>
			{avatar}
		</Link>
	) : (
		<button onClick={onClick} className={className}>
			{avatar}
		</button>
	);
}
