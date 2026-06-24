'use client';

import { usePathname } from 'next/navigation';
import { match } from 'path-to-regexp';
import { IMenuItem } from '@/shared/types/menu';
import { MenuItem } from './MenuItem';

interface Props {
	menuItems: IMenuItem[];
	className?: string;
}

export function Menu({ menuItems, className }: Props) {
	const pathname = usePathname();

	return (
		<nav className={`flex flex-col gap-2 ${className ? className : ''}`}>
			{menuItems.map((element) => {
				return (
					<MenuItem
						key={element.title}
						menuItem={element}
						link={element.link}
						isActive={!!match(pathname)(element.link)}
					/>
				);
			})}
		</nav>
	);
}
