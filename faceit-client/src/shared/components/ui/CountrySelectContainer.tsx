'use client';

import { useEffect, useState } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { CountrySelect } from './CountrySelect';
import { CountryFlag } from './CountryFlag';

interface Country {
	name: {
		common: string;
	};
	flags: {
		svg: string;
		alt: string;
	};
}

interface Props<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	error?: string;
}

export function CountrySelectContainer<T extends FieldValues>({
	control,
	name,
	error
}: Props<T>) {
	const [countries, setCountries] = useState<Country[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchCountries() {
			try {
				const res = await fetch(
					'https://restcountries.com/v3.1/all?fields=name,flags'
				);
				const countriesData = await res.json();

				countriesData.sort((a: Country, b: Country) =>
					a.name.common.localeCompare(b.name.common)
				);

				setCountries(countriesData);
			} catch (e) {
				console.error('Failed to load countries', e);
			} finally {
				setIsLoading(false);
			}
		}

		fetchCountries();
	}, []);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => {
				const options = countries.map((c) => ({
					name: c.name.common,
					flag: c.flags.svg
				}));

				const selectedCountry = countries.find(
					(c) => c.name.common === field.value
				);

				return (
					<div className="flex flex-col gap-1 w-full mt-7">
						<div className={`flex items-center gap-3`}>
							<CountrySelect
								value={field.value}
								onChange={field.onChange}
								countries={options}
								isDisabled={isLoading}
								error={error}
							/>

							<CountryFlag
								flag={selectedCountry?.flags.svg}
								alt={selectedCountry?.name.common}
							/>
						</div>

						{error && (
							<span className="text-red-500 text-sm text-left">
								{error}
							</span>
						)}
					</div>
				);
			}}
		/>
	);
}
