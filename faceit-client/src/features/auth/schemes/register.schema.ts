import * as z from 'zod';

export const RegisterSchema = z
	.object({
		nickname: z.string().min(1, {
			message: 'Input nickname'
		}),
		email: z.string().email({
			message: 'Invalid email'
		}),
		password: z.string().min(8, {
			message: 'Min password length is 8'
		}),
		passwordRepeat: z.string().min(8, {
			message: 'Min password length is 8'
		})
	})
	.refine((data) => data.password === data.passwordRepeat, {
		message: 'Passwords don`t match',
		path: ['passwordRepeat']
	});

export type TRegisterSchema = z.infer<typeof RegisterSchema>;
