import express from 'express';
import { body } from 'express-validator';
import {
  startSession,
  endSession,
  getActiveSession,
  getSessions,
} from '../controllers/focusController.js';

const router = express.Router();

// Validation rules
const startSessionValidation = [
  body('mode')
    .optional()
    .isIn(['study', 'coding', 'review', 'exam'])
    .withMessage('Invalid mode'),
  body('project')
    .optional()
    .isIn(['GA', 'Poly', 'Oureon', 'Personal'])
    .withMessage('Invalid project'),
  body('plannedMinutes')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Planned minutes must be a positive integer'),
];

const endSessionValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('note').optional().trim(),
];

// Routes
router.post('/start', startSessionValidation, startSession);
router.post('/:id/end', endSessionValidation, endSession);
router.get('/active', getActiveSession);
router.get('/', getSessions);

export default router;
