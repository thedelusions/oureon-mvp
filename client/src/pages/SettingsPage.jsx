import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Card, Button, Select, Loading, ErrorBanner } from '../components/ui';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preferences, setPreferences] = useState({
    defaultFocusMinutes: 25,
    defaultProject: 'Personal',
    defaultFocusMode: 'Deep Work',
  });

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      const response = await api.patch('/auth/preferences', preferences);
      setSuccess('Settings saved successfully!');
      // Update user in context
      if (updateUser) {
        updateUser({ ...user, preferences: response.data.data.preferences });
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const projects = ['Personal', 'Work', 'Study', 'Health', 'Other'];
  const modes = ['Deep Work', 'Study', 'Meeting', 'Break', 'Other'];
  const durations = [
    { value: 15, label: '15 minutes' },
    { value: 25, label: '25 minutes (Pomodoro)' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '60 minutes' },
    { value: 90, label: '90 minutes' },
  ];

  if (loading) {
    return <Loading text="Loading settings..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Settings</h1>
        <p className="text-textMuted">
          Customize your Oureon experience and set your defaults
        </p>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-400">{success}</p>
        </div>
      )}

      <div className="max-w-2xl">
        <Card>
          <h2 className="heading-2 mb-6">Focus Session Defaults</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Select
                label="Default Focus Duration"
                value={preferences.defaultFocusMinutes}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    defaultFocusMinutes: Number(e.target.value),
                  })
                }
                options={durations}
              />
              <p className="text-xs text-textMuted mt-2">
                This will be pre-selected when you start a new focus session
              </p>
            </div>

            <div>
              <Select
                label="Default Project"
                value={preferences.defaultProject}
                onChange={(e) =>
                  setPreferences({ ...preferences, defaultProject: e.target.value })
                }
                options={projects.map((p) => ({ value: p, label: p }))}
              />
              <p className="text-xs text-textMuted mt-2">
                Your go-to project for quick focus sessions
              </p>
            </div>

            <div>
              <Select
                label="Default Focus Mode"
                value={preferences.defaultFocusMode}
                onChange={(e) =>
                  setPreferences({ ...preferences, defaultFocusMode: e.target.value })
                }
                options={modes.map((m) => ({ value: m, label: m }))}
              />
              <p className="text-xs text-textMuted mt-2">
                The focus mode you use most often
              </p>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Account Info */}
        <Card className="mt-6">
          <h2 className="heading-2 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-textMuted mb-1">Name</p>
              <p className="text-sm text-textPrimary">{user?.name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs text-textMuted mb-1">Email</p>
              <p className="text-sm text-textPrimary">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <Card className="mt-6 bg-surface/50">
          <h3 className="heading-3 mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-textMuted">
            <li>• Start with 25-minute sessions if you're new to focused work</li>
            <li>• Gradually increase duration as you build focus stamina</li>
            <li>• Use consistent projects to build focused routines</li>
            <li>• Review your insights weekly to track improvement</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
