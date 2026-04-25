import { ICONS } from '@/config/icons.config'
import { IMenuItem } from '@/shared/types/menu'
import Link from 'next/link'

interface Props {
	menuItem: IMenuItem
	link: string
	isActive: boolean
}

export function MenuItem({ menuItem, link, isActive }: Props) {
	const Icon = ICONS[menuItem.icon]

	return (
		<Link
			className={`border-4 border-transparent ${isActive ? 'border-l-amber-50' : ''}`}
			href={link}
		>
			<div
				className={`flex items-center gap-3 mx-4 px-4 py-2 hover:bg-neutral-800 duration-300 rounded-xl ${isActive ? 'text-neutral-50 bg-neutral-800' : 'text-neutral-400'}`}
			>
				<Icon size={24} />
				<p className="text-xl">{menuItem.title}</p>
			</div>
		</Link>
	)
}
