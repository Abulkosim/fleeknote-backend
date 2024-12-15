import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import noteRoutes from './routes/notes';
import publicRoutes from './routes/public';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import swaggerUi from 'swagger-ui-express';
import { specs } from './utils/swagger';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: `, error);
        process.exit(1);
    }
}

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting server: ', error);
    }
};

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api', publicRoutes);
app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

startServer();

export default app;