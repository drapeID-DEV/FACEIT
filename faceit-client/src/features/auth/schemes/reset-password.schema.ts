import * as z from 'zod';

export const ResetSchema = z.object({
	email: z.string().email({
		message: 'Invalid email'
	})
});

export type TResetSchema = z.infer<typeof ResetSchema>;
