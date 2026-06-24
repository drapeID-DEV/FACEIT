import * as z from 'zod';

export const NewPasswordSchema = z.object({
	password: z.string().min(8, {
		message: 'Min password length is 8'
	})
});

export type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>;
