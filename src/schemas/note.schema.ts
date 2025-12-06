import { z } from 'zod';

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

export const createNoteSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .max(200, 'Title must not exceed 200 characters')
            .optional()
            .default('Untitled'),
        content: z
            .string()
            .optional()
            .default(''),
        isPublic: z
            .boolean()
            .optional()
            .default(false)
    })
});

export const updateNoteSchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .max(200, 'Title must not exceed 200 characters')
            .optional(),
        content: z
            .string()
            .optional(),
        isPublic: z
            .boolean()
            .optional()
    }),
    params: z.object({
        id: objectIdSchema
    })
});

export const getNoteSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

export const deleteNoteSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

export const togglePublishSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

export const getNoteLinkSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type GetNoteInput = z.infer<typeof getNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;
export type TogglePublishInput = z.infer<typeof togglePublishSchema>;
export type GetNoteLinkInput = z.infer<typeof getNoteLinkSchema>;
