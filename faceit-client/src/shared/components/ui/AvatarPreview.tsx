interface Props {
	preview: string;
}

export function AvatarPreview({ preview }: Props) {
	return (
		<div className="w-100 h-100 rounded-2xl bg-accent flex justify-center items-center">
			{!preview ? (
				<p className="text-2xl">No avatar yet</p>
			) : (
				<img src={preview} alt="" />
			)}
		</div>
	);
}
