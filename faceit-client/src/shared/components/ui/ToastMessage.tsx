interface ToastMessageProps {
	title: string;
	description?: string;
}

export function ToastMessage({ title, description }: ToastMessageProps) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-semibold text-md text-white">{title}</span>

			{description && (
				<span className="text-sm text-neutral-400 leading-relaxed">
					{description}
				</span>
			)}
		</div>
	);
}
