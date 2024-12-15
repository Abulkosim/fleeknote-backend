import express from 'express';
import { auth } from '../middleware/auth';
import { 
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote
} from '../controllers/notes';

const router = express.Router();

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.get('/:id', auth, getNote);
router.patch('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);

export default router; 