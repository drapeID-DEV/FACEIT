'use client';

import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';
import { ProfileTabBtn } from './ProfileTabBtn';
import { PROFILE_TABS } from '@/config/profileTabs.config';

interface Props {
	nickname: string;
}

export function ProfileTabsControl({ nickname }: Props) {
	const pathname = usePathname();

	return (
		<nav className="text-xl flex justify-around w-full">
			{PROFILE_TABS.map((tab) => {
				const href = tab.segment
					? `/players/${nickname}/${tab.segment}`
					: `/players/${nickname}`;

				console.log(href);

				return (
					<ProfileTabBtn
						key={tab.title}
						href={href}
						title={tab.title}
						isActive={!!match(href)(pathname)}
					/>
				);
			})}
		</nav>
	);
}
