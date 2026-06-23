import {
	BaseQueryFn,
	createApi,
	fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_SERVER_API_URL,
	credentials: 'include'
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	const isAuthRequest =
		typeof args !== 'string' && args.url?.includes('/auth');

	if (result.error?.status === 401 && !isAuthRequest) {
		if (typeof window !== 'undefined') {
			window.location.href = '/auth/login';
		}
	}

	return result;
};

export const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Profile'],
	endpoints: () => ({})
});
