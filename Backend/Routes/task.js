import express from 'express';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected
router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;