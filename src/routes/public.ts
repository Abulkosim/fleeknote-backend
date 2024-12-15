import express from 'express';
import { getUserPublicNotes, getPublicNoteBySlug } from '../controllers/public';

const router = express.Router();

router.get('/:username/notes', getUserPublicNotes);
router.get('/:username/notes/:slug', getPublicNoteBySlug);

export default router; 