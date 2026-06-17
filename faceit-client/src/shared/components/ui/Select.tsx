'use client';

import { forwardRef } from 'react';

interface Option {
	label: string;
	value: string;
}

interface SelectProps {
	label?: string;
	options: Option[];
	value?: string;
	onChange?: (value: string) => void;
	error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ label, options, value, onChange, error }, ref) => {
		return (
			<div className="flex flex-col gap-1">
				{label && <label className="text-sm">{label}</label>}

				<select
					ref={ref}
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
				>
					<option value="">Select...</option>

					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>

				{error && <span className="text-red-500 text-sm">{error}</span>}
			</div>
		);
	}
);

Select.displayName = 'Select';
