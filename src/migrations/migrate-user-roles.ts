import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

dotenv.config();

const migrateUserRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        const result = await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user' } }
        );

        console.log(`Migration complete! Updated ${result.modifiedCount} users with default role 'user'`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateUserRoles();

