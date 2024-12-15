import { Request, Response, RequestHandler } from 'express';
import User from '../models/User';
import Note from '../models/Note';

export const getUserPublicNotes: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username } = req.params;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const notes = await Note.find({ 
            owner: user._id,
            isPublic: true 
        }).select('title content slug createdAt updatedAt');

        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching public notes' });
    }
};

export const getPublicNoteBySlug: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, slug } = req.params;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const note = await Note.findOne({
            owner: user._id,
            slug,
            isPublic: true
        }).select('title content slug createdAt updatedAt');

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching note' });
    }
}; 