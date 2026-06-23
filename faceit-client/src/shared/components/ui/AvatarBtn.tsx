'use client';
import { useGetProfileQuery } from '@/store/api/userApi';

interface Props {
	onClick?: () => void;
}

export function AvatarBtn({ onClick }: Props) {
	const { data, isLoading } = useGetProfileQuery();

	return (
		<button
			onClick={onClick}
			className={
				'overflow-hidden w-10 h-10 border-2 border-transparent rounded-full hover:cursor-pointer hover:border-neutral-700 ' +
				(data?.profilePic ? '' : 'bg-amber-600')
			}
		>
			{data?.profilePic && <img src={data?.profilePic} alt="PP" />}
		</button>
	);
}
