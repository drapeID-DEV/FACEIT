import * as z from 'zod';

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Invalid email'
	}),
	password: z.string().min(8, {
		message: 'Min password length is 8'
	})
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
