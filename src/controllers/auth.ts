import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register: RequestHandler = async (req, res): Promise<any> => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '7d'
        });

        res.status(201).json({ user: { id: user._id, username, email }, token })
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
}

export const login: RequestHandler = async (req, res): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '7d'
        })

        res.json({ user: { id: user._id, username: user.username, email }, token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
}