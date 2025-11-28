import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Card, Loading, ErrorBanner } from '../components/ui';

const TimelinePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState('week');

  useEffect(() => {
    fetchTimeline();
  }, [range]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const response = await api.get('/timeline', { params: { range } });
      setEvents(response.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (events) => {
    const grouped = {};
    events.forEach((event) => {
      const date = new Date(event.createdAt).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (dateOnly.getTime() === todayOnly.getTime()) return 'Today';
    if (dateOnly.getTime() === yesterdayOnly.getTime()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'TASK_CREATED':
        return '➕';
      case 'TASK_COMPLETED':
        return '✓';
      case 'TASK_DELETED':
        return '🗑️';
      case 'FOCUS_STARTED':
        return '▶️';
      case 'FOCUS_ENDED':
        return '⏱️';
      default:
        return '•';
    }
  };

  const getEventText = (event) => {
    const { type, metadata } = event;

    switch (type) {
      case 'TASK_CREATED':
        return {
          title: `Created task: ${metadata.title}`,
          description: `${metadata.project} • ${metadata.type}`,
        };
      case 'TASK_COMPLETED':
        return {
          title: `Completed task: ${metadata.title}`,
          description: `${metadata.project}`,
        };
      case 'TASK_DELETED':
        return {
          title: `Deleted task: ${metadata.title}`,
          description: `${metadata.project}`,
        };
      case 'FOCUS_STARTED':
        return {
          title: `Started ${metadata.mode} session`,
          description: `${metadata.project} • ${metadata.plannedMinutes} min planned`,
        };
      case 'FOCUS_ENDED':
        return {
          title: `Finished ${metadata.mode} session`,
          description: `${metadata.project} • ${metadata.actualMinutes} min${
            metadata.rating ? ` • Rating: ${'⭐'.repeat(metadata.rating)}` : ''
          }`,
        };
      default:
        return { title: type, description: '' };
    }
  };

  const EventCard = ({ event }) => {
    const { type, createdAt } = event;
    const time = new Date(createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const { title, description } = getEventText(event);
    const icon = getEventIcon(type);

    return (
      <div className="bg-surface border border-white/5 rounded-lg px-4 py-3 hover:border-white/10 transition-colors">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-textPrimary font-medium">{title}</p>
              <span className="text-xs text-textMuted whitespace-nowrap">{time}</span>
            </div>
            {description && (
              <p className="text-xs text-textMuted mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const groupedByDate = groupByDate(events);
  const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="heading-1 mb-2">Memory Timeline</h1>
          <p className="text-textMuted">
            A chronological view of your tasks, focus sessions, and progress
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRange('today')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              range === 'today'
                ? 'bg-accent text-white'
                : 'bg-surface text-textMuted hover:text-textPrimary border border-white/10'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              range === 'week'
                ? 'bg-accent text-white'
                : 'bg-surface text-textMuted hover:text-textPrimary border border-white/10'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              range === 'month'
                ? 'bg-accent text-white'
                : 'bg-surface text-textMuted hover:text-textPrimary border border-white/10'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {loading ? (
        <Loading text="Loading timeline..." />
      ) : events.length === 0 ? (
        <Card className="text-center py-12">
          <span className="text-5xl mb-4 block">📅</span>
          <p className="text-textMuted mb-2">No activity yet</p>
          <p className="text-sm text-textMuted">
            Create a task or start a focus session to build your timeline
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <section key={date} className="flex gap-6">
              {/* Date Label */}
              <div className="w-24 text-right pt-2">
                <p className="text-sm font-medium text-textMuted sticky top-24">
                  {formatDateLabel(date)}
                </p>
              </div>

              {/* Timeline */}
              <div className="relative flex-1">
                {/* Vertical line */}
                <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />

                {/* Events */}
                <div className="space-y-4">
                  {groupedByDate[date].map((event) => (
                    <div key={event._id} className="relative pl-8">
                      {/* Dot */}
                      <div className="absolute left-0 top-4 w-6 h-6 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelinePage;
