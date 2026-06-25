'use client';

import { Loader } from '@/shared/components/ui/Loader';
import { TApiError } from '@/shared/types/api/responses';
import { notification } from '@/shared/utils/notifications';
import { useNewVerificationMutation } from '@/store/api/authApi';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function EmailVerificationForm() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const token = searchParams.get('token');

	const [verify] = useNewVerificationMutation();

	useEffect(() => {
		if (!token) return;

		const verifyEmail = async () => {
			try {
				await verify(token).unwrap();

				router.push('/');
			} catch (error) {
				const err = error as TApiError;
				notification.error(err.data.message);

				router.push('/auth/login');
			}
		};

		verifyEmail();
	}, [token, verify, router]);

	return <Loader />;
}
