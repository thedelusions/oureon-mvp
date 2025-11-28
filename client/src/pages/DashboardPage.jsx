import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card, Button, Loading, EmptyState } from '../components/ui';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [weeklyInsights, setWeeklyInsights] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksRes, summaryRes, sessionRes, insightsRes] = await Promise.all([
        api.get('/tasks?scope=today'),
        api.get('/summary/daily'),
        api.get('/focus/active'),
        api.get('/insights/weekly'),
      ]);

      setTasks(tasksRes.data.data.tasks);
      setDailySummary(summaryRes.data.data);
      setActiveSession(sessionRes.data.data.session);
      setWeeklyInsights(insightsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getElapsedTime = (startedAt) => {
    return Math.floor((Date.now() - new Date(startedAt)) / 1000);
  };

  if (loading) {
    return <Loading text="Loading dashboard..." />;
  }

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="heading-1 mb-2">Welcome back, {firstName} 👋</h1>
        <p className="text-textMuted">
          {dailySummary?.totalMinutesToday > 0
            ? `You've focused for ${dailySummary.totalMinutesToday} minutes today. Keep it up!`
            : "Let's make today productive!"}
        </p>
      </div>

      {/* Weekly Highlights */}
      {weeklyInsights && (
        <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-textMuted mb-1">This Week</p>
                <p className="text-2xl font-bold text-textPrimary">
                  {weeklyInsights.totalFocusHours}h focus time
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-xs text-textMuted mb-1">Tasks</p>
                <p className="text-2xl font-bold text-textPrimary">
                  {weeklyInsights.tasksCompleted} completed
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-xs text-textMuted mb-1">Active Days</p>
                <p className="text-2xl font-bold text-textPrimary">
                  {weeklyInsights.daysWithFocus} / 7 days
                  {weeklyInsights.streak >= 3 && ' 🔥'}
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate('/app/insights')}>
              View Insights
            </Button>
          </div>
        </Card>
      )}

      {/* Suggestion Card */}
      {weeklyInsights?.suggestions?.[0] && (
        <Card className="bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-medium text-textPrimary mb-1">
                Suggestion for you
              </p>
              <p className="text-sm text-textMuted">
                {weeklyInsights.suggestions[0]}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-textMuted text-sm mb-1">Today's Focus</div>
          <div className="text-3xl font-bold text-textPrimary">
            {dailySummary?.totalMinutesToday || 0}
            <span className="text-lg text-textMuted ml-1">min</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-textMuted text-sm mb-1">Sessions</div>
          <div className="text-3xl font-bold text-textPrimary">
            {dailySummary?.sessionsToday || 0}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-textMuted text-sm mb-1">Completed Tasks</div>
          <div className="text-3xl font-bold text-accent">
            {dailySummary?.tasksCompletedToday || 0}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-textMuted text-sm mb-1">Total Tasks</div>
          <div className="text-3xl font-bold text-textPrimary">
            {dailySummary?.totalTasksToday || 0}
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-2">Today's Tasks</h2>
              <Button variant="secondary" onClick={() => navigate('/app/tasks')}>
                View All
              </Button>
            </div>

            {tasks.length === 0 ? (
              <EmptyState
                icon="📝"
                title="No tasks for today"
                description="Create a task to get started"
                action={
                  <Button variant="primary" onClick={() => navigate('/app/tasks')}>
                    Add Task
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task._id}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task._id)}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-surface text-accent focus:ring-2 focus:ring-accent cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          task.completed
                            ? 'line-through text-textMuted'
                            : 'text-textPrimary'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded">
                          {task.project}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-white/10 text-textMuted rounded">
                          {task.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Focus Session */}
          {activeSession ? (
            <Card>
              <h3 className="heading-3 mb-4">Active Session 🎯</h3>
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">
                  {formatTime(getElapsedTime(activeSession.startedAt))}
                </div>
                <div className="text-textMuted mb-4">
                  <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                    {activeSession.mode}
                  </span>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate('/app/focus')}
                >
                  Go to Focus
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <h3 className="heading-3 mb-4">Focus Session</h3>
              <p className="text-textMuted text-sm mb-4">
                Start a focus session to boost your productivity
              </p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/app/focus')}
              >
                Start Session
              </Button>
            </Card>
          )}

          {/* Upcoming Deadlines */}
          <Card>
            <h3 className="heading-3 mb-4">Upcoming Deadlines</h3>
            {dailySummary?.upcomingDeadlines?.length > 0 ? (
              <div className="space-y-3">
                {dailySummary.upcomingDeadlines.map((task) => (
                  <div
                    key={task._id}
                    className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <p className="text-sm font-medium text-textPrimary mb-1">
                      {task.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded">
                        {task.project}
                      </span>
                      <span className="text-xs text-textMuted">
                        {new Date(task.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-textMuted text-sm text-center py-4">
                No upcoming deadlines
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
