import express from 'express';
import { body } from 'express-validator';
import {
  createTask,
  getTasks,
  updateTask,
  completeTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

// Validation rules
const taskValidation = [
  body('title').notEmpty().trim().withMessage('Task title is required'),
  body('description').optional().trim(),
  body('project')
    .optional()
    .isIn(['GA', 'Poly', 'Oureon', 'Personal'])
    .withMessage('Invalid project'),
  body('type')
    .optional()
    .isIn(['study', 'code', 'admin', 'life'])
    .withMessage('Invalid type'),
  body('deadline').optional().isISO8601().withMessage('Invalid date format'),
];

// Routes
router.post('/', taskValidation, createTask);
router.get('/', getTasks);
router.patch('/:id', updateTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

export default router;
