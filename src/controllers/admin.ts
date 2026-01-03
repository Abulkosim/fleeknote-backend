import User from '@/models/User';
import { RequestHandler}  from 'express';

export const getUsers: RequestHandler = async (req, res, next): Promise<any> => {
  try {
    const users = await User.find({}, { password: 0, avatar: 0 });
    res.status(200).json({ users });
  } catch (error) {
    next(error)
  }
}