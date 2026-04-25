'use client'

import { MenuItem } from './MenuItem'
import { usePathname } from 'next/navigation'
import { match } from 'path-to-regexp'
import { IMenuItem } from '@/shared/types/menu'

interface Props {
	menuItems: IMenuItem[]
	className?: string
}

export function Menu({ menuItems, className }: Props) {
	const pathname = usePathname()

	return (
		<nav className={`flex flex-col gap-2 ${className ? className : ''}`}>
			{menuItems.map((element) => {
				const href = element.dynamic
					? element.link.replace('[userID]', '123')
					: element.link
				return (
					<MenuItem
						key={element.title}
						menuItem={element}
						link={href}
						isActive={!!match(pathname)(href)}
					/>
				)
			})}
		</nav>
	)
}
