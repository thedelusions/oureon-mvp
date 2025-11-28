import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Card, Loading, ErrorBanner } from '../components/ui';

const InsightsPage = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await api.get('/insights/weekly');
      setInsights(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, subtext, accent }) => (
    <Card className="p-6 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {accent && (
          <span className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full font-medium">
            {accent}
          </span>
        )}
      </div>
      <p className="text-xs text-textMuted mb-2">{label}</p>
      <p className="text-3xl font-bold text-textPrimary mb-1">{value}</p>
      {subtext && <p className="text-xs text-textMuted">{subtext}</p>}
    </Card>
  );

  if (loading) {
    return <Loading text="Analyzing your data..." />;
  }

  if (!insights) {
    return (
      <Card className="text-center py-12">
        <span className="text-5xl mb-4 block">📊</span>
        <p className="text-textMuted">No insights available yet</p>
      </Card>
    );
  }

  const completionPercentage = Math.round(insights.completionRate * 100);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Insights & Analytics</h1>
        <p className="text-textMuted">
          Your productivity patterns and intelligent suggestions for this week
        </p>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {/* Oureon Hints */}
      {insights.suggestions && insights.suggestions.length > 0 && (
        <Card className="mb-8 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-start gap-4">
            <div className="text-3xl mt-1">💡</div>
            <div className="flex-1">
              <h2 className="heading-3 mb-3">Oureon Hints</h2>
              <div className="space-y-2">
                {insights.suggestions.map((suggestion, index) => (
                  <p key={index} className="text-sm text-textPrimary">
                    {suggestion}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="⏱️"
          label="Total Focus Time"
          value={`${insights.totalFocusHours}h`}
          subtext={`${insights.sessionsCount} sessions · avg ${insights.avgSessionDuration} min`}
          accent={insights.streak >= 3 ? `${insights.streak} day streak 🔥` : null}
        />

        <StatCard
          icon="✓"
          label="Tasks Completed"
          value={`${insights.tasksCompleted} / ${insights.tasksCreated}`}
          subtext={`${completionPercentage}% completion rate`}
        />

        <StatCard
          icon="📊"
          label="Most Active Project"
          value={insights.mostActiveProject || 'N/A'}
          subtext={insights.mostActiveProject ? 'Keep the momentum!' : 'Start a session'}
        />

        <StatCard
          icon="📅"
          label="Days with Focus"
          value={`${insights.daysWithFocus} / 7`}
          subtext={
            insights.daysWithFocus >= 5
              ? 'Excellent consistency!'
              : 'Try to increase frequency'
          }
        />

        <StatCard
          icon="⭐"
          label="Avg Session Rating"
          value={insights.avgSessionRating || 'N/A'}
          subtext={
            insights.avgSessionRating
              ? insights.avgSessionRating >= 4
                ? 'High quality focus!'
                : 'Room for improvement'
              : 'Rate your sessions'
          }
        />

        <StatCard
          icon="🔥"
          label="Current Streak"
          value={insights.streak > 0 ? `${insights.streak} days` : 'Start today!'}
          subtext={
            insights.streak > 0
              ? 'Keep going!'
              : 'Complete a session to start a streak'
          }
        />
      </div>

      {/* Performance Summary */}
      <Card>
        <h2 className="heading-2 mb-6">This Week's Performance</h2>

        <div className="space-y-6">
          {/* Focus Time Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-textMuted">Focus Time Progress</span>
              <span className="text-sm font-medium text-textPrimary">
                {insights.totalFocusHours}h / 10h goal
              </span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-purple-400 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (parseFloat(insights.totalFocusHours) / 10) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Task Completion Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-textMuted">Task Completion Rate</span>
              <span className="text-sm font-medium text-textPrimary">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  completionPercentage >= 70
                    ? 'bg-green-500'
                    : completionPercentage >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Active Days */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-textMuted">Active Days</span>
              <span className="text-sm font-medium text-textPrimary">
                {insights.daysWithFocus} / 7 days
              </span>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <div
                  key={day}
                  className={`flex-1 h-12 rounded-lg ${
                    day < insights.daysWithFocus
                      ? 'bg-accent'
                      : 'bg-white/5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InsightsPage;
