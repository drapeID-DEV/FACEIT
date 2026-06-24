'use client';

import { useForm } from 'react-hook-form';

import {
	RegisterSchema,
	TRegisterSchema
} from '@/features/auth/schemes/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/Input';
import { notification } from '@/shared/utils/notifications';
import { useRegisterMutation } from '@/store/api/authApi';
import { TApiError } from '@/shared/types/api/responses';
import { AuthWrapper } from '@/features/auth/components/AuthWrapper';
import { SettingsSchema, TSettingsSchema } from '../../schemes/settings.schema';
import { useGetMeQuery } from '@/store/api/userApi';

export function AccountSettingsForm() {
	const { data, isLoading } = useGetMeQuery();

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm<TSettingsSchema>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			nickname: data?.nickname,
			email: data?.email,
			isTwoFactorEnabled: data?.isTwoFactorEnabled || false
		}
	});

	const onSubmit = async (values: TSettingsSchema) => {
		// try {
		// 	const response = await registerUser(values).unwrap();
		// 	reset();
		// 	notification.info(response.message);
		// } catch (error) {
		// 	const err = error as TApiError;
		// 	notification.error(err.data.message);
		// }
	};

	return (
		<AuthWrapper title="Update profile">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-5 text-sm"
			>
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
				<button
					className="bg-widget py-2 px-5 rounded-md hover:bg-amber-900 duration-200"
					type="submit"
					disabled={isLoading}
				>
					Update
				</button>
			</form>
		</AuthWrapper>
	);
}
