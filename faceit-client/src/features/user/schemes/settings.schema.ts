import * as z from 'zod';

export const SettingsSchema = z.object({
	email: z.string().email({
		message: 'Invalid email'
	}),
	nickname: z.string().min(1, {
		message: 'Input nickname'
	}),
	isTwoFactorEnabled: z.boolean()
});

export type TSettingsSchema = z.infer<typeof SettingsSchema>;
