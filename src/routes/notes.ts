import express from 'express';
import { auth } from '../middleware/auth';
import { 
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    togglePublish
} from '../controllers/notes';

const router = express.Router();

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.get('/:id', auth, getNote);
router.patch('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);
router.post('/:id/toggle-publish', auth, togglePublish);

export default router; 