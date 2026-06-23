import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_SERVER_API_URL,
	credentials: 'include'
});

const appBaseQuery: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error?.status === 401) {
		if (typeof window !== 'undefined') {
			window.location.replace('/auth/login');
		}
	}

	return result;
};

export const api = createApi({
	reducerPath: 'api',
	baseQuery: appBaseQuery,
	tagTypes: ['Profile'],
	endpoints: () => ({})
});
