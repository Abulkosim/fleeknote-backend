import { Request, Response, RequestHandler, NextFunction } from 'express';
import { createError, sendResetEmail, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils';
import User from '../models/User';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth';

export const register: RequestHandler = async (req, res, next): Promise<any> => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw createError(400, 'User already exists');
        }

        const user = new User({ username, email, password });
        await user.save();

        const tokenPayload = { 
            id: String(user._id), 
            username: user.username, 
            role: user.role || 'user' 
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        user.refreshTokens.push(refreshToken);
        await user.save();

<<<<<<< Updated upstream
        res.status(201).json({ user: { id: user._id, username, email }, token })
=======
        res.status(201).json({ 
            user: { 
                id: user._id, 
                username, 
                email,
                role: user.role || 'user',
                avatar: user.avatar || null,
            }, 
            accessToken,
            refreshToken
        })
>>>>>>> Stashed changes
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

        const tokenPayload = { 
            id: String(user._id), 
            username: user.username, 
            role: user.role || 'user' 
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        user.refreshTokens.push(refreshToken);
        await user.save();

<<<<<<< Updated upstream
        res.json({ user: { id: user._id, username: user.username, email }, token });
=======
        res.json({ 
            user: { 
                id: user._id, 
                username: user.username, 
                email,
                role: user.role || 'user',
                avatar: user.avatar || null,
            }, 
            accessToken,
            refreshToken
        });
>>>>>>> Stashed changes
    } catch (error) {
        next(error);
    }
}

export const forgotPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw createError(404, 'No user found with this email');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.set('resetPasswordToken', crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex'));

        user.set('resetPasswordExpires', new Date(Date.now() + 30 * 60 * 1000));
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await sendResetEmail(user.email, resetUrl);
            res.json({
                message: 'Password reset link sent to email'
            });
        } catch (emailError) {
            user.set('resetPasswordToken', null);
            user.set('resetPasswordExpires', null);
            await user.save();

            throw createError(500, 'Error sending password reset email');
        }
    } catch (error) {
        next(error);
    }
};

export const resetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw createError(400, 'Invalid or expired reset token');
        }
        user.password = password;
        user.set('resetPasswordToken', null);
        user.set('resetPasswordExpires', null);
        await user.save();

        res.json({
            message: 'Password reset successful'
        });
    } catch (error) {
        next(error);
    }
};

export const getUser: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const user = await User.findById(req.user?.id).select('-password');
        res.json(user);
    } catch (error) {
        next(error);
    }
};
// TODO: delete notes too
export const deleteUser: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        await User.findByIdAndDelete(req.user?.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateProfile: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, avatar } = req.body;

        const user = await User.findById(req.user?.id);
        if (!user) {
            throw createError(404, 'User not found');
        }

        if (username && username.trim()) {
            user.username = username.trim();
        }

        if (avatar) {
            user.avatar = avatar;
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        next(error);
    }
}

export const refresh: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw createError(401, 'Refresh token required');
        }

        const decoded = verifyRefreshToken(refreshToken);

        const user = await User.findById(decoded.id);
        if (!user) {
            throw createError(401, 'Invalid refresh token');
        }

        if (!user.refreshTokens.includes(refreshToken)) {
            throw createError(401, 'Invalid or revoked refresh token');
        }

        const tokenPayload = { 
            id: String(user._id), 
            username: user.username, 
            role: user.role || 'user' 
        };
        const accessToken = generateAccessToken(tokenPayload);

        res.json({ 
            accessToken
        });
    } catch (error) {
        next(error);
    }
}

export const logout: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw createError(400, 'Refresh token required');
        }

        const user = await User.findById(req.user?.id);
        if (!user) {
            throw createError(404, 'User not found');
        }

        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        await user.save();

        res.json({ 
            message: 'Logged out successfully' 
        });
    } catch (error) {
        next(error);
    }
}