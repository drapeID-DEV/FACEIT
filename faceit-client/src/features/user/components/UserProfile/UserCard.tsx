import { IPlayerProfile } from '@/shared/types/api/responses';
import Image from 'next/image';

interface Props {
	userData: IPlayerProfile;
}

export function UserCard({ userData }: Props) {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-accent bg-primary px-20 py-25">
				<div className="relative h-35 w-35 overflow-hidden rounded-full">
					{userData.profilePic ? (
						<Image
							src={userData.profilePic}
							alt={`${userData.nickname} avatar`}
							fill
							sizes="140px"
							className="object-cover"
						/>
					) : (
						<div className="h-full w-full bg-amber-600" />
					)}
				</div>

				<h2 className="text-3xl font-bold">{userData.nickname}</h2>
			</div>

			<p className="text-sm font-bold text-white">
				Joined {new Date(userData.createdAt).toLocaleDateString()}
			</p>
		</div>
	);
}
