'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/Input';
import { notification } from '@/shared/utils/notifications';
import { TApiError } from '@/shared/types/api/responses';
import { AuthWrapper } from '@/features/auth/components/AuthWrapper';
import { SettingsSchema, TSettingsSchema } from '../../schemes/settings.schema';
import { useGetMeQuery, useUpdateProfileMutation } from '@/store/api/userApi';
import { Loader } from '@/shared/components/ui/Loader';
import { TwoFactorCard } from '@/shared/components/ui/TwoFactorCard';

export function AccountSettingsForm() {
	const { data, isLoading } = useGetMeQuery();
	const [update, { isLoading: isLoadingUpdate }] = useUpdateProfileMutation();

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
		try {
			const response = await update(values).unwrap();
			notification.info('Profile updated!');
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	const isCredentialsMethod = data?.method === 'CREDENTIALS';

	return isLoading ? (
		<Loader />
	) : (
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
				{isCredentialsMethod && (
					<Controller
						control={control}
						name="isTwoFactorEnabled"
						render={({ field }) => (
							<TwoFactorCard
								checked={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
				)}
				<button
					className="bg-widget py-2 px-5 rounded-md hover:bg-amber-900 duration-200"
					type="submit"
					disabled={isLoadingUpdate}
				>
					Update
				</button>
			</form>
		</AuthWrapper>
	);
}
