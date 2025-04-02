import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import apiRoutes from './routes/index';
import errorHandler from './middleware/errorHandler';

dotenv.config(); // Load environment variables from .env file

const app: Express = express();
const port = process.env.PORT || 5032;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: clientUrl, // Allow requests from the frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// API Routes
app.use('/api', apiRoutes);

// Root Route (optional)
app.get('/', (req: Request, res: Response) => {
  res.send('Prompt Library API Running');
});

// Error Handling Middleware (should be last)
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[server]: Allowing requests from ${clientUrl}`);
});