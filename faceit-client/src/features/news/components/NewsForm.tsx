'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormButton } from '@/shared/components/ui/FormButton';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { TApiError } from '@/shared/types/api/responses';
import { INews } from '@/shared/types/news';
import { notification } from '@/shared/utils/notifications';
import {
	useCreateNewsMutation,
	useUpdateNewsMutation
} from '@/store/api/newsApi';

import { NewsSchema, TNewsSchema } from '../schemes/news.schema';

interface Props {
	news?: INews;
	onDone?: () => void;
}

export function NewsForm({ news, onDone }: Props) {
	const [createNews, { isLoading: isCreating }] = useCreateNewsMutation();
	const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<TNewsSchema>({
		resolver: zodResolver(NewsSchema),
		defaultValues: {
			title: news?.title ?? '',
			description: news?.description ?? ''
		}
	});

	const onSubmit = async (values: TNewsSchema) => {
		try {
			if (news) {
				await updateNews({ id: news.id, data: values }).unwrap();
				notification.info('News updated!');
			} else {
				await createNews(values).unwrap();
				notification.info('News published!');
				reset();
			}

			onDone?.();
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-sm"
		>
			<h2 className="text-xl font-semibold">
				{news ? 'Edit news' : 'Create news'}
			</h2>
			<Input
				label="Title"
				placeholder="News title"
				{...register('title')}
				error={errors.title?.message}
			/>
			<Textarea
				label="Description"
				placeholder="Detailed description"
				rows={6}
				{...register('description')}
				error={errors.description?.message}
			/>
			<div className="flex gap-3">
				<FormButton
					title={news ? 'Save' : 'Publish'}
					type="submit"
					disabled={isCreating || isUpdating}
				/>
				{news && (
					<button
						type="button"
						onClick={onDone}
						className="rounded-md px-5 py-2 text-lg text-neutral-400 duration-200 hover:bg-accent"
					>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}
