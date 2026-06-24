import { IPlayerProfile } from '@/shared/types/api/responses';

interface Props {
	userData: IPlayerProfile;
}

export function UserCard({ userData }: Props) {
	const profilePicClass = 'overflow-hidden rounded-full w-35 h-35';

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex flex-col items-center gap-4 bg-primary rounded-2xl py-25 px-20 border-2 border-accent">
				{userData.profilePic ? (
					<img
						src={userData.profilePic}
						alt="PP"
						className={profilePicClass}
					/>
				) : (
					<div className={`bg-amber-600 ${profilePicClass}`}></div>
				)}
				<h2 className="text-3xl font-bold">{userData.nickname}</h2>
			</div>
			<p className="text-white text-sm font-bold">
				Joined {new Date(userData.createdAt).toLocaleDateString()}
			</p>
		</div>
	);
}
