import Link from 'next/link';
import Image from 'next/image';
import { CLUBS_MENU, MAIN_MENU, POINTS_MENU } from '@/config/pages.config';
import { MenuDevider } from '@/shared/components/ui/MenuDevider';
import { Menu } from '../Menu';

export function LeftSidebar() {
	return (
		<aside className="w-73 h-full bg-primary">
			<Link
				className="inline-block mx-8 my-5 w-fit p-2 hover:bg-accent rounded-xl duration-300"
				href={'/'}
			>
				<Image src={'/logo.webp'} alt="Logo" width={25} height={25} />
			</Link>
			<Menu menuItems={MAIN_MENU} />
			<MenuDevider />
			<Menu menuItems={CLUBS_MENU} />
			<MenuDevider />
			<Menu className="" menuItems={POINTS_MENU} />
		</aside>
	);
}
