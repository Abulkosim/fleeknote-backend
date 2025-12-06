import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema } from './common.schema';

export const registerSchema = z.object({
    body: z.object({
        username: usernameSchema,
        email: emailSchema,
        password: passwordSchema
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema
    })
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: emailSchema
    })
});

export const resetPasswordSchema = z.object({
    body: z.object({
        password: passwordSchema
    }),
    params: z.object({
        token: z.string('Reset token is required')
    })
});

export const updateProfileSchema = z.object({
    body: z.object({
        username: usernameSchema.optional(),
        avatar: z
            .string()
            .optional()
            .or(z.literal(''))
    })
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
