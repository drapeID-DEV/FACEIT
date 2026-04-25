interface Props {
	onClick?: () => void
}

export function AvatarBtn({ onClick }: Props) {
	return (
		<button
			onClick={onClick}
			className="overflow-hidden w-10 h-10 border-2 border-transparent rounded-4xl hover:cursor-pointer hover:border-neutral-700"
		>
			<img
				src="https://i.pinimg.com/474x/9d/e5/d2/9de5d2ab40011b354914c778341e3bff.jpg"
				alt=""
			/>
		</button>
	)
}
