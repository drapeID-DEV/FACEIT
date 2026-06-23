interface ToastMessageProps {
	content: string;
}

export function ToastMessage({ content }: ToastMessageProps) {
	const message = content.split('. ');

	return (
		<div className="flex flex-col gap-1">
			<span className="font-semibold text-md text-white">
				{message[0]}
			</span>
			<span className="text-sm text-neutral-400 leading-relaxed">
				{message[1]}
			</span>
		</div>
	);
}
