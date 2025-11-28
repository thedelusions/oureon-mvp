import { validationResult } from 'express-validator';
import FocusSession from '../models/FocusSession.js';

// @desc    Start a new focus session
// @route   POST /api/focus/start
// @access  Private
export const startSession = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.errors = errors.array();
      throw error;
    }

    // Check if there's already an active session
    const activeSession = await FocusSession.findOne({
      userId: req.user.id,
      endedAt: null,
    });

    if (activeSession) {
      const error = new Error(
        'You already have an active session. End it before starting a new one.'
      );
      error.statusCode = 400;
      throw error;
    }

    const { mode, project, plannedMinutes } = req.body;

    const session = await FocusSession.create({
      userId: req.user.id,
      mode,
      project,
      plannedMinutes,
      startedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Focus session started',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End a focus session
// @route   POST /api/focus/:id/end
// @access  Private
export const endSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, note } = req.body;

    const session = await FocusSession.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!session) {
      const error = new Error('Focus session not found');
      error.statusCode = 404;
      throw error;
    }

    if (session.endedAt) {
      const error = new Error('This session has already ended');
      error.statusCode = 400;
      throw error;
    }

    // End the session
    session.endedAt = new Date();
    if (rating !== undefined) session.rating = rating;
    if (note !== undefined) session.note = note;

    await session.save();

    res.json({
      success: true,
      message: 'Focus session ended',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active focus session
// @route   GET /api/focus/active
// @access  Private
export const getActiveSession = async (req, res, next) => {
  try {
    const session = await FocusSession.findOne({
      userId: req.user.id,
      endedAt: null,
    });

    res.json({
      success: true,
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get focus sessions
// @route   GET /api/focus?range=today|week
// @access  Private
export const getSessions = async (req, res, next) => {
  try {
    const { range = 'week' } = req.query;
    const query = { userId: req.user.id };

    // Apply range filter
    if (range === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      query.startedAt = { $gte: startOfDay, $lte: endOfDay };
    } else if (range === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      query.startedAt = { $gte: weekAgo };
    }

    const sessions = await FocusSession.find(query).sort({ startedAt: -1 });

    // Calculate total minutes
    const totalMinutes = sessions.reduce((sum, session) => {
      if (session.endedAt) {
        return sum + session.durationMinutes;
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      data: {
        sessions,
        count: sessions.length,
        totalMinutes,
      },
    });
  } catch (error) {
    next(error);
  }
};
