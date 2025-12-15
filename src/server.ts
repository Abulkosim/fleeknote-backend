import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { specs } from './utils';
import { connectDB } from './config/database';
import { authRoutes, noteRoutes, publicRoutes } from './routes';
import { errorHandler, apiLimiter, authLimiter } from './middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server', error);
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