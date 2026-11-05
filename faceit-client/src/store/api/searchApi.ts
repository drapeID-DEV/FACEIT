import { ISearchRes } from '@/shared/types/search';
import { api } from './baseApi';

export const searchApi = api.injectEndpoints({
	endpoints: (builder) => ({
		search: builder.query<ISearchRes, { q: string; limit: number }>({
			query: ({ q, limit }) => ({
				url: '/search',
				params: { q, limit }
			})
		})
	})
});

export const { useSearchQuery } = searchApi;
