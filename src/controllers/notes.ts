import { Response, RequestHandler, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../utils/errors';
import Note from '../models/Note';

export const createNote: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const note = new Note({
            ...req.body,
            owner: req.user?.id
        });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        next(error);
    }
};

export const getNotes: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const notes = await Note.find({ owner: req.user?.id });
        res.json(notes);
    } catch (error) {
        next(error);
    }
};

export const getNote: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const note = await Note.findOne({ _id: req.params.id, owner: req.user?.id });
        if (!note) {
            throw createError(404, 'Note not found');
        }
        res.json(note);
    } catch (error) {
        next(error);
    }
};

export const updateNote: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { slug, ...updateData } = req.body;
        
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, owner: req.user?.id },
            updateData,
            { new: true }
        );
        
        if (!note) {
            throw createError(404, 'Note not found');
        }
        
        res.json(note);
    } catch (error) {
        next(error);
    }
};

export const togglePublish: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const note = await Note.findOne({ _id: req.params.id, owner: req.user?.id });
        
        if (!note) {
            throw createError(404, 'Note not found');
        }

        note.isPublic = !note.isPublic;
        await note.save();
        
        res.json(note);
    } catch (error) {
        next(error);
    }
};

export const deleteNote: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user?.id });
        if (!note) {
            throw createError(404, 'Note not found');
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        next(error);
    }
}; 