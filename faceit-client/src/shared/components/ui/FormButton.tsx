import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
}

export function FormButton({ title, className, ...props }: Props) {
	return (
		<button
			className={`bg-widget py-2 px-5 rounded-md hover:bg-amber-900 duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed ${className ?? ''}`}
			{...props}
		>
			{title}
		</button>
	);
}
