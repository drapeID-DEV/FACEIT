'use client';

import { useForm } from 'react-hook-form';
import { AuthWrapper } from '../AuthWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/Input';
import { useResetPasswordMutation } from '@/store/api/authApi';
import { notification } from '@/shared/utils/notifications';
import { TApiError } from '@/shared/types/api/responses';
import { ResetSchema, TResetSchema } from '../../schemes/reset-password.schema';

export function ResetPasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<TResetSchema>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: ''
		}
	});

	const [resetPassword, { isLoading }] = useResetPasswordMutation();

	const onSubmit = async (values: TResetSchema) => {
		try {
			const response = await resetPassword(values).unwrap();

			notification.info(
				'Check your email. A confirmation link has been sent to your email address.'
			);

			reset();
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<AuthWrapper
			title="Reset password"
			backButtonLabel="Back to login"
			backButtonHref="/auth/login"
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<Input
					label="Email"
					placeholder="name@mail.com"
					{...register('email')}
					error={errors.email?.message}
				/>
				<button
					disabled={isLoading}
					className="bg-widget py-2 px-5 rounded-md hover:bg-amber-900 duration-200"
					type="submit"
				>
					Reset
				</button>
			</form>
		</AuthWrapper>
	);
}
