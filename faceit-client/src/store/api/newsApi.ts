import { TNewsSchema } from '@/features/news/schemes/news.schema';
import { INewsRes } from '@/shared/types/api/responses';
import { INews } from '@/shared/types/news';
import { api } from './baseApi';

export const newsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getNews: builder.query<INewsRes, { page: number; limit: number }>({
			query: ({ page = 1, limit = 10 }) =>
				`/news?page=${page}&limit=${limit}`,
			providesTags: ['News']
		}),
		createNews: builder.mutation<INews, TNewsSchema>({
			query: (data) => ({
				url: '/news',
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['News']
		}),
		updateNews: builder.mutation<INews, { id: string; data: TNewsSchema }>({
			query: ({ id, data }) => ({
				url: `/news/${id}`,
				method: 'PATCH',
				body: data
			}),
			invalidatesTags: ['News']
		}),
		deleteNews: builder.mutation<void, string>({
			query: (id) => ({
				url: `/news/${id}`,
				method: 'DELETE'
			}),
			invalidatesTags: ['News']
		})
	})
});

export const {
	useGetNewsQuery,
	useCreateNewsMutation,
	useUpdateNewsMutation,
	useDeleteNewsMutation
} = newsApi;
