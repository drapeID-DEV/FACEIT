import Link from 'next/link';
import { PropsWithChildren } from 'react';

interface Props {
	title: string;
	backButtonLabel?: string;
	backButtonHref?: string;
}

export function AuthWrapper({
	children,
	title,
	backButtonLabel,
	backButtonHref
}: PropsWithChildren<Props>) {
	return (
		<div className="p-8 w-100 bg-black rounded-2xl text-center space-y-5">
			<h1 className="text-2xl font-bold">{title}</h1>
			<div>{children}</div>
			<div>
				{backButtonLabel && backButtonHref && (
					<Link
						className="text-neutral-600 hover:text-neutral-200 hover:underline duration-200"
						href={backButtonHref}
					>
						{backButtonLabel}
					</Link>
				)}
			</div>
		</div>
	);
}
