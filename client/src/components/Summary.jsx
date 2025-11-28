import { useState, useEffect } from 'react';
import api from '../utils/api';

const Summary = () => {
  const [dailySummary, setDailySummary] = useState(null);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [view, setView] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const [dailyRes, weeklyRes] = await Promise.all([
        api.get('/summary/daily'),
        api.get('/summary/weekly'),
      ]);
      setDailySummary(dailyRes.data.data);
      setWeeklySummary(weeklyRes.data.data);
    } catch (error) {
      console.error('Failed to fetch summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8 text-gray-500">Loading summary...</div>
      </div>
    );
  }

  const summary = view === 'daily' ? dailySummary : weeklySummary;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Summary</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('daily')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              view === 'daily'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              view === 'weekly'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {view === 'daily' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              {dailySummary.tasksCompletedToday}
            </div>
            <div className="text-sm text-blue-600 mt-1">Tasks Completed</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">
              {dailySummary.totalTasksToday}
            </div>
            <div className="text-sm text-purple-600 mt-1">Total Tasks</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {dailySummary.sessionsToday}
            </div>
            <div className="text-sm text-green-600 mt-1">Focus Sessions</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700">
              {dailySummary.totalMinutesToday}
            </div>
            <div className="text-sm text-orange-600 mt-1">Minutes Focused</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-700">
                {weeklySummary.tasksCompletedLastWeek}
              </div>
              <div className="text-sm text-blue-600 mt-1">Tasks Completed</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-700">
                {weeklySummary.completionRate}%
              </div>
              <div className="text-sm text-purple-600 mt-1">Completion Rate</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-700">
                {weeklySummary.totalSessionsLastWeek}
              </div>
              <div className="text-sm text-green-600 mt-1">Focus Sessions</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-700">
                {weeklySummary.totalMinutesLastWeek}
              </div>
              <div className="text-sm text-orange-600 mt-1">Minutes Focused</div>
            </div>
          </div>

          {weeklySummary.mostActiveProject && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Most Active Project</div>
              <div className="text-lg font-semibold text-gray-900">
                {weeklySummary.mostActiveProject.name}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({weeklySummary.mostActiveProject.sessions} sessions)
                </span>
              </div>
            </div>
          )}

          {weeklySummary.averageRating && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Average Focus Rating</div>
              <div className="text-lg font-semibold text-gray-900">
                ⭐ {weeklySummary.averageRating} / 5
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'daily' && dailySummary.upcomingDeadlines?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Upcoming Deadlines</h3>
          <div className="space-y-2">
            {dailySummary.upcomingDeadlines.map((task) => (
              <div key={task._id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{task.title}</span>
                <span className="text-gray-500">
                  {new Date(task.deadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
