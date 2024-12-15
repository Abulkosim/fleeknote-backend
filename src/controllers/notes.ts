import { Response, RequestHandler } from 'express';
import { AuthRequest } from '../middleware/auth';
import Note from '../models/Note';

export const createNote: RequestHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const note = new Note({
            ...req.body,
            owner: req.user?.id
        });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Error creating note' });
    }
};

export const getNotes: RequestHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const notes = await Note.find({ owner: req.user?.id });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notes' });
    }
};

export const getNote: RequestHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const note = await Note.findOne({ _id: req.params.id, owner: req.user?.id });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching note' });
    }
};

export const updateNote: RequestHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, owner: req.user?.id },
            req.body,
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Error updating note' });
    }
};

export const deleteNote: RequestHandler = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user?.id });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting note' });
    }
}; 