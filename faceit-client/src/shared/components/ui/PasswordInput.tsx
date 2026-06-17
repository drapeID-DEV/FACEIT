'use client';

import { forwardRef, useState, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	placeholder: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, Props>(
	({ label, error, className, ...props }, ref) => {
		const [isShown, setIsShow] = useState(false);

		return (
			<div className="flex flex-col gap-1 text-left">
				{label && (
					<label className="text-sm text-neutral-400">{label}</label>
				)}

				<div className="relative">
					<input
						ref={ref}
						type={isShown ? 'text' : 'password'}
						className={clsx(
							'w-full px-3 py-2 pr-10 rounded-md bg-neutral-800 border text-white outline-none',
							error
								? 'border-red-500'
								: 'border-neutral-700 focus:border-neutral-500',
							className
						)}
						{...props}
					/>

					<button
						type="button"
						onClick={() => setIsShow((prev) => !prev)}
						className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
					>
						{isShown ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				</div>

				{error && <span className="text-red-500 text-sm">{error}</span>}
			</div>
		);
	}
);

PasswordInput.displayName = 'PasswordInput';
