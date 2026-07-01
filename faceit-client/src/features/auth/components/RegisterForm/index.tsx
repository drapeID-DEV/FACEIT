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
import { useRegisterMutation } from '@/store/api/authApi';
import { TApiError } from '@/shared/types/api/responses';
import { FormButton } from '@/shared/components/ui/FormButton';

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

	const [registerUser, { isLoading }] = useRegisterMutation();

	const onSubmit = async (values: TRegisterSchema) => {
		try {
			const response = await registerUser(values).unwrap();

			reset();

			notification.info(response.message);
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<AuthWrapper
			title="Register"
			backButtonLabel="Have account?"
			backButtonHref="/auth/login"
			isShowSocial
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
				<FormButton title="Register" disabled={isLoading} />
			</form>
		</AuthWrapper>
	);
}
