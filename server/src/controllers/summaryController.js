import Task from '../models/Task.js';
import FocusSession from '../models/FocusSession.js';

// @desc    Get daily summary
// @route   GET /api/summary/daily
// @access  Private
export const getDailySummary = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Tasks completed today
    const tasksCompletedToday = await Task.countDocuments({
      userId: req.user.id,
      completed: true,
      completedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Total tasks today (created or with deadline)
    const totalTasksToday = await Task.countDocuments({
      userId: req.user.id,
      $or: [
        { createdAt: { $gte: startOfDay, $lte: endOfDay } },
        { deadline: { $gte: startOfDay, $lte: endOfDay } },
      ],
    });

    // Focus sessions today
    const sessionsToday = await FocusSession.find({
      userId: req.user.id,
      startedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalMinutesToday = sessionsToday.reduce((sum, session) => {
      if (session.endedAt) {
        return sum + session.durationMinutes;
      }
      return sum;
    }, 0);

    // Upcoming deadlines (next 3 days)
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const upcomingDeadlines = await Task.find({
      userId: req.user.id,
      completed: false,
      deadline: { $gte: today, $lte: threeDaysLater },
    })
      .sort({ deadline: 1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        tasksCompletedToday,
        totalTasksToday,
        sessionsToday: sessionsToday.length,
        totalMinutesToday,
        upcomingDeadlines,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly summary
// @route   GET /api/summary/weekly
// @access  Private
export const getWeeklySummary = async (req, res, next) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Focus sessions in last 7 days
    const sessionsLastWeek = await FocusSession.find({
      userId: req.user.id,
      startedAt: { $gte: weekAgo },
    });

    const totalMinutesLastWeek = sessionsLastWeek.reduce((sum, session) => {
      if (session.endedAt) {
        return sum + session.durationMinutes;
      }
      return sum;
    }, 0);

    // Tasks created vs completed
    const tasksCreatedLastWeek = await Task.countDocuments({
      userId: req.user.id,
      createdAt: { $gte: weekAgo },
    });

    const tasksCompletedLastWeek = await Task.countDocuments({
      userId: req.user.id,
      completed: true,
      completedAt: { $gte: weekAgo },
    });

    // Most active project (by sessions)
    const projectCounts = {};
    sessionsLastWeek.forEach((session) => {
      if (session.project) {
        projectCounts[session.project] =
          (projectCounts[session.project] || 0) + 1;
      }
    });

    const mostActiveProject =
      Object.keys(projectCounts).length > 0
        ? Object.entries(projectCounts).reduce((a, b) => (b[1] > a[1] ? b : a))
        : null;

    // Average session rating
    const sessionsWithRating = sessionsLastWeek.filter((s) => s.rating);
    const averageRating =
      sessionsWithRating.length > 0
        ? (
            sessionsWithRating.reduce((sum, s) => sum + s.rating, 0) /
            sessionsWithRating.length
          ).toFixed(1)
        : null;

    res.json({
      success: true,
      data: {
        totalMinutesLastWeek,
        totalSessionsLastWeek: sessionsLastWeek.length,
        tasksCreatedLastWeek,
        tasksCompletedLastWeek,
        completionRate:
          tasksCreatedLastWeek > 0
            ? Math.round((tasksCompletedLastWeek / tasksCreatedLastWeek) * 100)
            : 0,
        mostActiveProject: mostActiveProject
          ? {
              name: mostActiveProject[0],
              sessions: mostActiveProject[1],
            }
          : null,
        averageRating: averageRating ? parseFloat(averageRating) : null,
      },
    });
  } catch (error) {
    next(error);
  }
};
