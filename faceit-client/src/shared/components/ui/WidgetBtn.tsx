import Link from 'next/link';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	className?: string;
}

interface LinkProps extends BaseProps {
	isLink: true;
	href: string;
}

interface DefaultButtonProps extends BaseProps {
	isLink?: false;
	href?: never;
}

type Props = LinkProps | DefaultButtonProps;

export function WidgetBtn({
	children,
	isLink,
	href,
	title,
	className = '',
	...props
}: PropsWithChildren<Props>) {
	const classes =
		'px-12 py-2 bg-widget text-white font-bold rounded-2xl text-xl h-max gap-3 flex ' +
		className;

	if (isLink) {
		return (
			<Link href={href} className={classes}>
				{title}
				{children}
			</Link>
		);
	}

	return (
		<button {...props} className={classes}>
			{title}
			{children}
		</button>
	);
}
