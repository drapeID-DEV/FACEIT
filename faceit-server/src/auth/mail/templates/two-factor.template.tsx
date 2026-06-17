import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components'
import * as React from 'react'

interface TwoFactorAuthTemplateProps {
	token: string
}

export function TwoFactorAuthTemplate({
	token
}: TwoFactorAuthTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Your FACEIT verification code</Preview>
			<Tailwind>
				<Body className="bg-black py-10 px-5 font-sans">
					<Container className="mx-auto max-w-[600px] rounded-xl border border-zinc-800 bg-zinc-950 p-10">
						<Heading className="m-0 mb-8 text-center text-5xl font-black tracking-wider text-white">
							FACEIT
						</Heading>
						<Heading className="mb-8 text-center text-3xl font-bold text-white">
							Two-Factor Authentication
						</Heading>
						<Text className="mb-5 text-base leading-7 text-zinc-300">
							We received a request to sign in to your FACEIT
							account.
						</Text>

						<Text className="mb-8 text-base leading-7 text-zinc-300">
							Use the verification code below to complete the
							sign-in process:
						</Text>
						<Section className="my-10 text-center">
							<div className="inline-block rounded-lg border border-orange-500 bg-zinc-900 px-8 py-5">
								<Text className="m-0 text-4xl font-black tracking-[12px] text-orange-500">
									{token}
								</Text>
							</div>
						</Section>
						<Text className="mb-5 text-base leading-7 text-zinc-300">
							This code will expire in 10 minutes.
						</Text>
						<Text className="mt-8 border-t border-zinc-800 pt-5 text-sm leading-6 text-zinc-500">
							If you did not attempt to sign in, please ignore
							this email and consider changing your password.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default TwoFactorAuthTemplate