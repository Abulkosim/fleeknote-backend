import { Request, Response, RequestHandler, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/errors';
import User from '../models/User';

export const register: RequestHandler = async (req, res, next): Promise<any> => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw createError(400, 'User already exists');
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '7d'
        });

        res.status(201).json({ user: { id: user._id, username, email }, token })
    } catch (error) {
        next(error);
    }
}

export const login: RequestHandler = async (req, res, next): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw createError(401, 'Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw createError(401, 'Invalid credentials');
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '7d'
        })

        res.json({ user: { id: user._id, username: user.username, email }, token });
    } catch (error) {
        next(error);
    }
}