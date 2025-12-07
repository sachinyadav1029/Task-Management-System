import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import { startTaskScheduler } from './utils/taskScheduler.js';

// Import models to ensure they are registered with mongoose
import User from './Models/Userdata.js';
import Task from './Models/Task.js';

// Route imports
import authRoutes from './Routes/auth.js';
import taskRoutes from './Routes/task.js';

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://task-management-system-khaki-five.vercel.app"],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running successfully' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Start the task scheduler after server starts
  startTaskScheduler();
});