import Link from 'next/link';

interface Props {
	href: string;
	title: string;
	isActive: boolean;
}

export function ProfileTabBtn({ href, title, isActive }: Props) {
	return (
		<Link
			className={`transition-colors ${
				isActive
					? 'text-widget border-b'
					: 'text-white hover:text-widget'
			}`}
			href={href}
		>
			{title}
		</Link>
	);
}
