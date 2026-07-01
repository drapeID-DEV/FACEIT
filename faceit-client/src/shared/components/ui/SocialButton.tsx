import Image from 'next/image';

interface Props {
	title: string;
	imageURL: string;
	authHref: string;
}

export function SocialButton({ title, imageURL, authHref }: Props) {
	const handleSocialLogin = () => {
		window.location.href = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/${authHref}`;
	};

	return (
		<button
			type="button"
			onClick={handleSocialLogin}
			className="flex w-full items-center justify-center gap-6 text-sm font-bold rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white transition-colors hover:bg-neutral-800"
		>
			<Image src={imageURL} alt={title} width={20} height={20} />

			<span>Continue with {title}</span>
		</button>
	);
}
