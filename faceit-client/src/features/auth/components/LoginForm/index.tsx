'use client';

import { useForm } from 'react-hook-form';
import { AuthWrapper } from '../AuthWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/Input';
import { PasswordInput } from '@/shared/components/ui/PasswordInput';
import {
	LoginSchema,
	TLoginSchema
} from '@/features/auth/schemes/login.schema';
import { useLoginMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';

export function LoginForm() {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<TLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const router = useRouter();
	const [login] = useLoginMutation();

	const onSubmit = async (values: TLoginSchema) => {
		try {
			await login(values).unwrap();

			// router.push('/');
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<AuthWrapper
			title="Login"
			backButtonLabel="Don't have account?"
			backButtonHref="/auth/register"
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<Input
					label="Email"
					placeholder="name@mail.com"
					{...register('email')}
					error={errors.email?.message}
				/>

				<PasswordInput
					label="Password"
					placeholder="******"
					{...register('password')}
					error={errors.password?.message}
				/>

				<button
					className="bg-widget py-2 px-5 rounded-md hover:bg-amber-900 duration-200"
					type="submit"
				>
					Login
				</button>
			</form>
		</AuthWrapper>
	);
}
