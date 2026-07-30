interface RowProps {
	label: string;
	value: React.ReactNode;
}

export default function TooltipRow({ label, value }: RowProps) {
	return (
		<div className="flex items-center justify-between border-t border-zinc-800 first:border-0 py-2">
			<span className="text-sm text-zinc-400">{label}</span>
			<div className="text-base font-semibold">{value}</div>
		</div>
	);
}
