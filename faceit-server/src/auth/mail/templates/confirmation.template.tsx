import * as React from 'react'

import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface ConfirmationTemplateProps {
	domain: string
	token: string
}

export function ConfirmationTemplate({
	domain,
	token
}: ConfirmationTemplateProps) {
	const confirmLink = `${domain}/auth/verify?token=${token}`

	return (
		<Html>
			<Head />
			<Preview>Confirm your FACEIT account</Preview>
			<Tailwind>
				<Body className="bg-black py-10 px-5 font-sans">
					<Container className="mx-auto max-w-[600px] rounded-xl border border-zinc-800 bg-zinc-950 p-10">
						<Heading className="m-0 mb-8 text-center text-5xl font-black tracking-wider text-white">
							FACEIT
						</Heading>
						<Heading className="mb-8 text-center text-3xl font-bold text-white">
							Confirm Your Email Address
						</Heading>
						<Text className="mb-5 text-base leading-7 text-zinc-300">
							Welcome to FACEIT!
						</Text>
						<Text className="mb-5 text-base leading-7 text-zinc-300">
							Thank you for creating an account. To complete your
							registration and activate your account, please
							confirm your email address by clicking the button
							below.
						</Text>
						<Section className="my-10 text-center">
							<Button
								href={confirmLink}
								className="rounded-lg bg-orange-500 px-8 py-4 text-base font-bold text-white no-underline"
							>
								Confirm Email
							</Button>
						</Section>
						<Text className="mb-4 text-base leading-7 text-zinc-300">
							If the button above does not work, copy and paste
							the following link into your browser:
						</Text>
						<Link
							href={confirmLink}
							className="break-all text-sm text-orange-500"
						>
							{confirmLink}
						</Link>
						<Text className="mt-8 border-t border-zinc-800 pt-5 text-sm leading-6 text-zinc-500">
							If you did not create a FACEIT account, you can
							safely ignore this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default ConfirmationTemplate