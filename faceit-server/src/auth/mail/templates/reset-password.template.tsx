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
	Tailwind,
	Text
} from '@react-email/components'
import * as React from 'react'

interface ResetPasswordTemplateProps {
	domain: string
	token: string
}

export function ResetPasswordTemplate({
	domain,
	token
}: ResetPasswordTemplateProps) {
	const resetLink = `${domain}/auth/new-password?token=${token}`

	return (
		<Html>
			<Head />
			<Preview>Reset your FACEIT password</Preview>
			<Tailwind>
				<Body className="bg-black py-10 px-5 font-sans">
					<Container className="mx-auto max-w-[600px] rounded-xl border border-zinc-800 bg-zinc-950 p-10">
						<Heading className="m-0 mb-8 text-center text-5xl font-black tracking-wider text-white">
							FACEIT
						</Heading>
						<Heading className="mb-8 text-center text-3xl font-bold text-white">
							Reset Your Password
						</Heading>
						<Text className="mb-5 text-base leading-7 text-zinc-300">
							We received a request to reset the password for your
							FACEIT account.
						</Text>
						<Text className="mb-5 text-base leading-7 text-zinc-300">
							Click the button below to create a new password and
							regain access to your account.
						</Text>
						<Section className="my-10 text-center">
							<Button
								href={resetLink}
								className="rounded-lg bg-orange-500 px-8 py-4 text-base font-bold text-white no-underline"
							>
								Reset Password
							</Button>
						</Section>
						<Text className="mb-4 text-base leading-7 text-zinc-300">
							If the button above does not work, copy and paste
							the following link into your browser:
						</Text>
						<Link
							href={resetLink}
							className="break-all text-sm text-orange-500"
						>
							{resetLink}
						</Link>
						<Text className="mt-8 border-t border-zinc-800 pt-5 text-sm leading-6 text-zinc-500">
							This password reset link will expire in 24 hours.
						</Text>
						<Text className="mt-3 text-sm leading-6 text-zinc-500">
							If you did not request a password reset, you can
							safely ignore this email. Your account will remain
							secure.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default ResetPasswordTemplate