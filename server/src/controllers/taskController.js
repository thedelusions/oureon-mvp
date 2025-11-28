import { validationResult } from 'express-validator';
import Task from '../models/Task.js';

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.errors = errors.array();
      throw error;
    }

    const { title, description, project, type, deadline } = req.body;

    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      project,
      type,
      deadline,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks with filtering
// @route   GET /api/tasks?scope=today|week|all
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { scope = 'all' } = req.query;
    const query = { userId: req.user.id };

    // Apply scope filter
    if (scope === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      query.$or = [
        { deadline: { $gte: startOfDay, $lte: endOfDay } },
        { createdAt: { $gte: startOfDay, $lte: endOfDay } },
      ];
    } else if (scope === 'week') {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      query.deadline = {
        $gte: today,
        $lte: nextWeek,
      };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        tasks,
        count: tasks.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PATCH /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, project, type, deadline } = req.body;

    const task = await Task.findOne({ _id: id, userId: req.user.id });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (project !== undefined) task.project = project;
    if (type !== undefined) task.type = type;
    if (deadline !== undefined) task.deadline = deadline;

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/complete
// @access  Private
export const completeTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId: req.user.id });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    // Toggle completion
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    await task.save();

    res.json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
