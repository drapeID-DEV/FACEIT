import {
	BaseQueryFn,
	createApi,
	fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { useRouter } from 'next/navigation';

const router = useRouter;

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_SERVER_API_URL,
	credentials: 'include'
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	const isAuthRequest =
		typeof args !== 'string' && args.url?.includes('/auth');

	if (result.error?.status === 401 && !isAuthRequest) {
		const refreshResult = await baseQuery(
			{ url: '/auth/refresh', method: 'POST' },
			api,
			extraOptions
		);

		if (refreshResult.data) {
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (typeof window !== 'undefined') {
				// router.push('/auth/login')
			}
		}
	}

	return result;
};

export const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({})
});
