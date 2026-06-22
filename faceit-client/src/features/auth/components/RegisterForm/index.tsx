'use client';

import { useForm } from 'react-hook-form';
import { AuthWrapper } from '../AuthWrapper';
import {
	RegisterSchema,
	TRegisterSchema
} from '@/features/auth/schemes/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/Input';
import { PasswordInput } from '@/shared/components/ui/PasswordInput';
import { notification } from '@/shared/utils/notifications';

export function RegisterForm() {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm<TRegisterSchema>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			nickname: '',
			email: '',
			password: '',
			passwordRepeat: ''
		}
	});

	const onSubmit = (values: TRegisterSchema) => {
		console.log(values);
		reset();
		notification.success(
			'Registration Successful',
			'Please check your email to verify your account.'
		);
	};

	return (
		<AuthWrapper
			title="Register"
			backButtonLabel="Have account?"
			backButtonHref="/auth/login"
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<Input
					label="Nickname"
					placeholder="nickname"
					{...register('nickname')}
					error={errors.nickname?.message}
				/>
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
				<PasswordInput
					label="Repeat password"
					placeholder="******"
					{...register('passwordRepeat')}
					error={errors.passwordRepeat?.message}
				/>
				<button
					className="bg-widget py-2 px-5 rounded-md hover:bg-amber-900 duration-200"
					type="submit"
				>
					Register
				</button>
			</form>
		</AuthWrapper>
	);
}
