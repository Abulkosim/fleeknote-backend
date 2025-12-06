import { z } from 'zod';


export const emailSchema = z
    .string('Email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim();

export const passwordSchema = z
    .string('Password is required')
    .min(6, 'Password must be at least 6 characters long');

export const usernameSchema = z
    .string('Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must not exceed 30 characters')
    .trim()
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');