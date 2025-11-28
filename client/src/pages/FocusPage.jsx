import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Loading,
  EmptyState,
  ErrorBanner,
} from '../components/ui';

const FocusPage = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [endSessionData, setEndSessionData] = useState({
    rating: 0,
    notes: '',
  });
  const [formData, setFormData] = useState({
    mode: user?.preferences?.defaultFocusMode || 'Deep Work',
    project: user?.preferences?.defaultProject || 'Personal',
    plannedMinutes: user?.preferences?.defaultFocusMinutes || 25,
  });

  const modes = ['Deep Work', 'Study', 'Meeting', 'Break', 'Other'];
  const projects = ['Personal', 'Work', 'Study', 'Health', 'Other'];

  useEffect(() => {
    checkActiveSession();
  }, []);

  // Update form defaults when user preferences change
  useEffect(() => {
    if (user?.preferences && !activeSession) {
      setFormData({
        mode: user.preferences.defaultFocusMode || 'Deep Work',
        project: user.preferences.defaultProject || 'Personal',
        plannedMinutes: user.preferences.defaultFocusMinutes || 25,
      });
    }
  }, [user, activeSession]);

  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - new Date(activeSession.startedAt)) / 1000
        );
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const checkActiveSession = async () => {
    try {
      setLoading(true);
      const response = await api.get('/focus/active');
      setActiveSession(response.data.data.session);
      if (response.data.data.session) {
        const elapsed = Math.floor(
          (Date.now() - new Date(response.data.data.session.startedAt)) / 1000
        );
        setElapsedTime(elapsed);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check session');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/focus', formData);
      setActiveSession(response.data.data.session);
      setElapsedTime(0);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start session');
    }
  };

  const handleEndSession = async () => {
    if (!endSessionData.rating) {
      setError('Please select a rating');
      return;
    }

    try {
      await api.patch(`/focus/${activeSession._id}/end`, endSessionData);
      setActiveSession(null);
      setElapsedTime(0);
      setShowEndModal(false);
      setEndSessionData({ rating: 0, notes: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end session');
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

  const getRemainingTime = () => {
    if (!activeSession) return 0;
    const targetSeconds = activeSession.plannedMinutes * 60;
    const remaining = targetSeconds - elapsedTime;
    return Math.max(0, remaining);
  };

  if (loading) {
    return <Loading text="Loading focus session..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Focus Session</h1>
        <p className="text-textMuted">
          Track your focused work time and boost productivity
        </p>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {activeSession ? (
        /* Active Session View */
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-2">
                {activeSession.mode}
              </span>
              <h2 className="heading-2 text-textMuted">{activeSession.project}</h2>
            </div>

            {/* Big Timer Display */}
            <div className="my-12">
              <div className={`text-8xl font-bold mb-4 ${getRemainingTime() === 0 ? 'text-green-500' : 'text-accent'}`}>
                {formatTime(getRemainingTime())}
              </div>
              <div className="text-textMuted">
                {getRemainingTime() === 0 ? 'Time\'s up! 🎉' : `Target: ${activeSession.plannedMinutes} minutes`}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-1000"
                  style={{
                    width: `${Math.min(
                      (elapsedTime / (activeSession.plannedMinutes * 60)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="text-textMuted text-sm mt-2">
                {Math.floor(elapsedTime / 60)} / {activeSession.plannedMinutes} minutes elapsed
              </div>
            </div>

            <Button
              variant="danger"
              onClick={() => setShowEndModal(true)}
              className="w-full max-w-xs mx-auto"
            >
              End Session
            </Button>
          </Card>

          {/* Tips Card */}
          <Card className="mt-6">
            <h3 className="heading-3 mb-3">Tips for Better Focus 💡</h3>
            <ul className="space-y-2 text-textMuted text-sm">
              <li>• Remove distractions from your workspace</li>
              <li>• Turn off notifications on your devices</li>
              <li>• Take short breaks every 25-30 minutes</li>
              <li>• Stay hydrated and maintain good posture</li>
            </ul>
          </Card>
        </div>
      ) : (
        /* Start Session Form */
        <div className="max-w-xl mx-auto">
          <Card>
            <h2 className="heading-2 mb-6">Start New Session</h2>
            <form onSubmit={handleStartSession} className="space-y-4">
              <Select
                label="Focus Mode"
                required
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                options={modes.map((m) => ({ value: m, label: m }))}
              />

              <Select
                label="Project"
                required
                value={formData.project}
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
                options={projects.map((p) => ({ value: p, label: p }))}
              />

              <Input
                label="Planned Duration (minutes)"
                type="number"
                required
                min="1"
                max="180"
                value={formData.plannedMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, plannedMinutes: Number(e.target.value) })
                }
                placeholder="25"
              />

              <div className="pt-4">
                <Button type="submit" variant="primary" className="w-full">
                  Start Focus Session 🎯
                </Button>
              </div>
            </form>
          </Card>

          {/* Recommended Durations */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <button
              onClick={() => setFormData({ ...formData, plannedMinutes: 25 })}
              className="p-4 bg-surface rounded-lg hover:bg-white/10 transition-colors border border-white/5"
            >
              <div className="text-2xl font-bold text-accent">25</div>
              <div className="text-textMuted text-sm">Pomodoro</div>
            </button>
            <button
              onClick={() => setFormData({ ...formData, plannedMinutes: 50 })}
              className="p-4 bg-surface rounded-lg hover:bg-white/10 transition-colors border border-white/5"
            >
              <div className="text-2xl font-bold text-accent">50</div>
              <div className="text-textMuted text-sm">Deep Work</div>
            </button>
            <button
              onClick={() => setFormData({ ...formData, plannedMinutes: 90 })}
              className="p-4 bg-surface rounded-lg hover:bg-white/10 transition-colors border border-white/5"
            >
              <div className="text-2xl font-bold text-accent">90</div>
              <div className="text-textMuted text-sm">Extended</div>
            </button>
          </div>
        </div>
      )}

      {/* End Session Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <h2 className="heading-2 mb-6">How was your session?</h2>

            {/* Rating Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-textMuted mb-3">
                Rate your focus (1-5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      setEndSessionData({ ...endSessionData, rating })
                    }
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                      endSessionData.rating === rating
                        ? 'bg-accent text-white scale-110'
                        : 'bg-surface text-textMuted hover:bg-white/10'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <Textarea
              label="Notes (optional)"
              value={endSessionData.notes}
              onChange={(e) =>
                setEndSessionData({ ...endSessionData, notes: e.target.value })
              }
              placeholder="What did you accomplish? Any reflections?"
              rows={4}
            />

            <div className="flex gap-3 mt-6">
              <Button
                variant="primary"
                onClick={handleEndSession}
                className="flex-1"
              >
                Complete Session
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEndModal(false);
                  setEndSessionData({ rating: 0, notes: '' });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FocusPage;
