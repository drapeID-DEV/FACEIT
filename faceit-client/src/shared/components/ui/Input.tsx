'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
	({ label, error, className, ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1 text-left">
				{label && (
					<label className="text-sm text-neutral-400">{label}</label>
				)}

				<input
					ref={ref}
					className={clsx(
						'px-3 py-2 rounded-md bg-neutral-800 border text-white outline-none',
						error
							? 'border-red-500'
							: 'border-neutral-700 focus:border-neutral-500',
						className
					)}
					{...props}
				/>

				{error && <span className="text-red-500 text-sm">{error}</span>}
			</div>
		);
	}
);

Input.displayName = 'Input';
