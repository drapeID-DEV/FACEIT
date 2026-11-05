import * as z from 'zod';

export const NewsSchema = z.object({
	title: z.string().trim().min(1, {
		message: 'Input title'
	}),
	description: z.string().trim().min(1, {
		message: 'Input description'
	})
});

export type TNewsSchema = z.infer<typeof NewsSchema>;
