interface Props {
	flag?: string;
	alt?: string;
}

export function CountryFlag({ flag, alt }: Props) {
	if (!flag) return null;

	return <img src={flag} alt={alt} className="w-10" />;
}
