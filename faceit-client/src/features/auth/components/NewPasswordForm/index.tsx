'use client';

import { useForm } from 'react-hook-form';
import { AuthWrapper } from '../AuthWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput } from '@/shared/components/ui/PasswordInput';
import { useNewPasswordMutation } from '@/store/api/authApi';
import { useRouter, useSearchParams } from 'next/navigation';
import { notification } from '@/shared/utils/notifications';
import { TApiError } from '@/shared/types/api/responses';
import {
	NewPasswordSchema,
	TNewPasswordSchema
} from '../../schemes/new-password.schema';

export function NewPasswordForm() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<TNewPasswordSchema>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: ''
		}
	});

	const router = useRouter();
	const searchParams = useSearchParams();

	const token = searchParams.get('token');

	const [newPassword, { isLoading }] = useNewPasswordMutation();

	const onSubmit = async (values: TNewPasswordSchema) => {
		if (!token) return;

		try {
			const response = await newPassword({
				token,
				data: values
			}).unwrap();

			router.push('/auth/login');

			notification.info(
				'Password changed. You can now login with your new password.'
			);
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<AuthWrapper
			title="Create password"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<div className="flex flex-col gap-4">
					<PasswordInput
						label="Password"
						placeholder="******"
						{...register('password')}
						error={errors.password?.message}
					/>
				</div>
				<button
					disabled={isLoading}
					className="bg-widget py-2 px-5 rounded-md hover:bg-amber-900 duration-200"
					type="submit"
				>
					Login
				</button>
			</form>
		</AuthWrapper>
	);
}
