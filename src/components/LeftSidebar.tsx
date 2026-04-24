import Link from 'next/link'
import { Menu } from './Menu'
import Image from 'next/image'
import { CLUBS_MENU, MAIN_MENU, POINTS_MENU } from '@/config/pages.config'

export function LeftSidebar() {
	return (
		<aside className="w-73 h-full bg-neutral-900">
			<Link
				className="inline-block mx-8 my-5 w-fit p-2 hover:bg-amber-950 rounded-xl duration-300"
				href={'/'}
			>
				<Image src={'/logo.webp'} alt="Logo" width={25} height={25} />
			</Link>
			<Menu menuItems={MAIN_MENU} />
			<div className="h-0.5 bg-neutral-800 my-7 mx-8"></div>
			<Menu menuItems={CLUBS_MENU} />
			<div className="h-0.5 bg-neutral-800 my-7"></div>
			<Menu className="" menuItems={POINTS_MENU} />
		</aside>
	)
}
