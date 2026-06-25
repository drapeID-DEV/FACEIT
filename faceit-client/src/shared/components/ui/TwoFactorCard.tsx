interface Props {
	checked: boolean;
	onChange: (value: boolean) => void;
}

export function TwoFactorCard({ checked, onChange }: Props) {
	return (
		<div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900 px-6 py-5 gap-3">
			<div>
				<h3 className="text-sm font-semibold text-white">
					Two-Factor Authentication
				</h3>
			</div>

			<button
				type="button"
				onClick={() => onChange(!checked)}
				className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
					checked ? 'bg-amber-600' : 'bg-neutral-700'
				}`}
			>
				<span
					className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
						checked ? 'translate-x-5' : ''
					}`}
				/>
			</button>
		</div>
	);
}
