import express from 'express';
import { getUserPublicNotes, getPublicNoteBySlug } from '../controllers/public';
import { validate } from '../middleware/validate';
import { getUserPublicNotesSchema, getPublicNoteBySlugSchema } from '../schemas/public.schema';

const router = express.Router();

/**
 * @swagger
 * /api/{username}/notes:
 *   get:
 *     summary: Get all public notes for a user
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of public notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       404:
 *         description: User not found
 */
router.get('/:username/notes', validate(getUserPublicNotesSchema), getUserPublicNotes);

/**
 * @swagger
 * /api/{username}/notes/{slug}:
 *   get:
 *     summary: Get a specific public note by slug
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note or user not found
 */
router.get('/:username/notes/:slug', validate(getPublicNoteBySlugSchema), getPublicNoteBySlug);

export default router; 