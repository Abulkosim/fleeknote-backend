import { z } from 'zod';
import { usernameSchema } from './common.schema';

export const getUserPublicNotesSchema = z.object({
    params: z.object({
        username: usernameSchema
    })
});

export const getPublicNoteBySlugSchema = z.object({
    params: z.object({
        username: usernameSchema,
        slug: z
            .string('Slug is required')
            .min(1, 'Slug cannot be empty')
            .regex(/^[a-z0-9-]+$/, 'Invalid slug format')
    })
});

export type GetUserPublicNotesInput = z.infer<typeof getUserPublicNotesSchema>;
export type GetPublicNoteBySlugInput = z.infer<typeof getPublicNoteBySlugSchema>;
