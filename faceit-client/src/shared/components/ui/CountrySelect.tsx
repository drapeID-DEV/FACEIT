interface Country {
	name: string;
	flag: string;
}

interface Props {
	value?: string;
	onChange: (value: string) => void;
	countries: Country[];
	isDisabled: boolean;
	error?: string;
}

export function CountrySelect({
	value,
	onChange,
	countries,
	isDisabled,
	error
}: Props) {
	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className={`w-full h-11 max-w-fit  bg-accent outline-0 border ${error ? 'border-red-500' : 'border-neutral-700'} rounded-md px-3 bg-accent hover:cursor-pointer`}
			disabled={isDisabled}
		>
			<option value="" disabled>
				Select country
			</option>

			{countries.map((c) => (
				<option key={c.name} value={c.name}>
					{c.name}
				</option>
			))}
		</select>
	);
}
