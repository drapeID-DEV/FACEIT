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
import { notification } from '@/shared/utils/notifications';
import { TApiError } from '@/shared/types/api/responses';
import Link from 'next/link';
import { useState } from 'react';
import { FormButton } from '@/shared/components/ui/FormButton';

export function LoginForm() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<TLoginSchema>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const router = useRouter();
	const [login, { isLoading, data }] = useLoginMutation();
	const [isShowTwoFactor, setIsShowTwoFactor] = useState(false);

	const onSubmit = async (values: TLoginSchema) => {
		try {
			const response = await login(values).unwrap();

			if ('message' in response) {
				setIsShowTwoFactor(true);

				notification.info(response.message);

				return;
			}

			router.push('/');
			reset();
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<AuthWrapper
			title="Login"
			backButtonLabel="Don't have account?"
			backButtonHref="/auth/register"
			isShowSocial
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				{isShowTwoFactor && (
					<Input
						label="Code"
						placeholder="123456"
						{...register('code')}
						error={errors.code?.message}
					/>
				)}
				{!isShowTwoFactor && (
					<>
						<Input
							label="Email"
							placeholder="name@mail.com"
							{...register('email')}
							error={errors.email?.message}
						/>
						<div className="flex flex-col gap-4">
							<PasswordInput
								label="Password"
								placeholder="******"
								{...register('password')}
								error={errors.password?.message}
							/>
							<Link
								href="/auth/reset-password"
								className="text-sm text-neutral-700 mr-auto hover:text-neutral-400 duration-200"
							>
								Forgot password?
							</Link>
						</div>
					</>
				)}
				<FormButton title="Login" disabled={isLoading} />
			</form>
		</AuthWrapper>
	);
}
