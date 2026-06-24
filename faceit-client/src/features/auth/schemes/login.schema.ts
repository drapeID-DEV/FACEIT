import * as z from 'zod';

export const LoginSchema = z.object({
	email: z.string().email({
		message: 'Invalid email'
	}),
	password: z.string().min(8, {
		message: 'Min password length is 8'
	}),
	code: z.optional(z.string())
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
