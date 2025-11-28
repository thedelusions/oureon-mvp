import express from 'express';
import { getDailySummary, getWeeklySummary } from '../controllers/summaryController.js';

const router = express.Router();

// Routes
router.get('/daily', getDailySummary);
router.get('/weekly', getWeeklySummary);

export default router;
