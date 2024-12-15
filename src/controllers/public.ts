import { Request, Response, RequestHandler, NextFunction} from 'express';
import { createError } from '../utils/errors';
import User from '../models/User';
import Note from '../models/Note';

export const getUserPublicNotes: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username } = req.params;
        
        const user = await User.findOne({ username });
        if (!user) {
            throw createError(404, 'User not found');
        }

        const notes = await Note.find({ 
            owner: user._id,
            isPublic: true 
        }).select('title content slug createdAt updatedAt');

        res.json(notes);
    } catch (error) {
        next(error);
    }
};

export const getPublicNoteBySlug: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, slug } = req.params;
        
        const user = await User.findOne({ username });
        if (!user) {
            throw createError(404, 'User not found');
        }

        const note = await Note.findOne({
            owner: user._id,
            slug,
            isPublic: true
        }).select('title content slug createdAt updatedAt');

        if (!note) {
            throw createError(404, 'Note not found');
        }

        res.json(note);
    } catch (error) {
        next(error);
    }
}; 