import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Card, Button, Loading, ErrorBanner } from '../components/ui';

const SummaryPage = () => {
  const [view, setView] = useState('daily'); // 'daily' or 'weekly'
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, [view]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const endpoint = view === 'daily' ? '/summary/daily' : '/summary/weekly';
      const response = await api.get(endpoint);
      setSummary(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, unit, icon }) => (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-2">
        <span className="text-textMuted text-sm">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-textPrimary">{value}</span>
        {unit && <span className="text-lg text-textMuted">{unit}</span>}
      </div>
    </Card>
  );

  if (loading) {
    return <Loading text="Loading summary..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Summary & Analytics</h1>
        <p className="text-textMuted">
          Track your productivity and focus patterns
        </p>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {/* View Toggle */}
      <div className="flex gap-2 bg-surface rounded-lg p-1 mb-8 w-fit">
        <button
          onClick={() => setView('daily')}
          className={`px-6 py-2 rounded-md transition-colors text-sm font-medium ${
            view === 'daily'
              ? 'bg-accent text-white'
              : 'text-textMuted hover:text-textPrimary'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setView('weekly')}
          className={`px-6 py-2 rounded-md transition-colors text-sm font-medium ${
            view === 'weekly'
              ? 'bg-accent text-white'
              : 'text-textMuted hover:text-textPrimary'
          }`}
        >
          Weekly
        </button>
      </div>

      {view === 'daily' && summary ? (
        <div className="space-y-8">
          {/* Daily Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Focus Time"
              value={summary.totalMinutesToday || 0}
              unit="min"
              icon="⏱️"
            />
            <StatCard
              label="Focus Sessions"
              value={summary.sessionsToday || 0}
              icon="🎯"
            />
            <StatCard
              label="Tasks Completed"
              value={summary.tasksCompletedToday || 0}
              icon="✓"
            />
            <StatCard
              label="Total Tasks"
              value={summary.totalTasksToday || 0}
              icon="📝"
            />
          </div>

          {/* Sessions List */}
          {summary.sessions && summary.sessions.length > 0 && (
            <Card>
              <h2 className="heading-2 mb-4">Today's Focus Sessions</h2>
              <div className="space-y-3">
                {summary.sessions.map((session) => (
                  <div
                    key={session._id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-textPrimary">
                          {session.mode}
                        </span>
                        <span className="text-sm px-2 py-0.5 bg-accent/20 text-accent rounded">
                          {session.project}
                        </span>
                      </div>
                      {session.notes && (
                        <p className="text-textMuted text-sm">{session.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">
                        {session.actualMinutes}
                        <span className="text-sm text-textMuted ml-1">min</span>
                      </div>
                      <div className="flex items-center gap-1 text-textMuted text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < session.rating ? 'text-accent' : 'text-white/20'
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Upcoming Deadlines */}
          {summary.upcomingDeadlines && summary.upcomingDeadlines.length > 0 && (
            <Card>
              <h2 className="heading-2 mb-4">Upcoming Deadlines</h2>
              <div className="space-y-3">
                {summary.upcomingDeadlines.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-textPrimary mb-1">
                        {task.title}
                      </h3>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded">
                          {task.project}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-white/10 text-textMuted rounded">
                          {task.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-textMuted">
                      📅{' '}
                      {new Date(task.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Weekly Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Focus Time"
              value={summary?.totalMinutes || 0}
              unit="min"
              icon="⏱️"
            />
            <StatCard
              label="Focus Sessions"
              value={summary?.totalSessions || 0}
              icon="🎯"
            />
            <StatCard
              label="Avg Session Rating"
              value={summary?.averageRating?.toFixed(1) || 0}
              unit="/ 5"
              icon="⭐"
            />
            <StatCard
              label="Most Active Project"
              value={summary?.mostActiveProject?.name || 'N/A'}
              icon="📊"
            />
          </div>

          {/* Tasks Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-3">Tasks Created</h3>
                <span className="text-2xl">📝</span>
              </div>
              <div className="text-4xl font-bold text-textPrimary">
                {summary?.tasksCreated || 0}
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-3">Tasks Completed</h3>
                <span className="text-2xl">✓</span>
              </div>
              <div className="text-4xl font-bold text-accent">
                {summary?.tasksCompleted || 0}
              </div>
              {summary?.tasksCreated > 0 && (
                <div className="mt-2 text-textMuted text-sm">
                  {Math.round(
                    (summary.tasksCompleted / summary.tasksCreated) * 100
                  )}
                  % completion rate
                </div>
              )}
            </Card>
          </div>

          {/* Focus Modes Breakdown */}
          {summary?.modeBreakdown && summary.modeBreakdown.length > 0 && (
            <Card>
              <h2 className="heading-2 mb-4">Focus Mode Breakdown</h2>
              <div className="space-y-3">
                {summary.modeBreakdown.map((item) => (
                  <div
                    key={item.mode}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {item.mode === 'Deep Work'
                          ? '🎯'
                          : item.mode === 'Study'
                          ? '📚'
                          : item.mode === 'Meeting'
                          ? '💼'
                          : item.mode === 'Break'
                          ? '☕'
                          : '📌'}
                      </span>
                      <span className="font-semibold text-textPrimary">
                        {item.mode}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-accent">
                        {item.totalMinutes} min
                      </div>
                      <div className="text-textMuted text-sm">
                        {item.sessionCount} sessions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Projects Breakdown */}
          {summary?.projectBreakdown && summary.projectBreakdown.length > 0 && (
            <Card>
              <h2 className="heading-2 mb-4">Project Time Distribution</h2>
              <div className="space-y-3">
                {summary.projectBreakdown.map((item) => (
                  <div key={item.project} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-textPrimary">
                        {item.project}
                      </span>
                      <span className="text-accent font-semibold">
                        {item.totalMinutes} min
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{
                          width: `${
                            (item.totalMinutes / summary.totalMinutes) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
