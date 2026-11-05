import { PropsWithChildren } from 'react';
import Link from 'next/link';

interface Props {
	title: string;
	subtitle?: string;
	href?: string;
	linkLabel?: string;
	onLinkClick?: () => void;
}

const linkClassName =
	'shrink-0 text-sm font-semibold uppercase text-widget duration-200 hover:opacity-80';

export function HomeSection({
	title,
	subtitle,
	href,
	linkLabel = 'See all',
	onLinkClick,
	children
}: PropsWithChildren<Props>) {
	return (
		<section className="flex min-w-0 flex-col gap-3">
			<div className="flex items-end justify-between gap-3">
				<div>
					<h2 className="text-xl font-semibold">{title}</h2>
					{subtitle && (
						<p className="text-xs text-neutral-400">{subtitle}</p>
					)}
				</div>
				{href && (
					<Link href={href} className={linkClassName}>
						{linkLabel}
					</Link>
				)}
				{onLinkClick && (
					<button
						type="button"
						onClick={onLinkClick}
						className={linkClassName}
					>
						{linkLabel}
					</button>
				)}
			</div>
			{children}
		</section>
	);
}
