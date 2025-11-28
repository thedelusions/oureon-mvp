import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const FocusTimer = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mode, setMode] = useState('study');
  const [project, setProject] = useState('Personal');
  const [plannedMinutes, setPlannedMinutes] = useState(25);
  const [rating, setRating] = useState(null);
  const [note, setNote] = useState('');
  const [showEndForm, setShowEndForm] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    checkActiveSession();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (activeSession) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [activeSession]);

  const checkActiveSession = async () => {
    try {
      const response = await api.get('/focus/active');
      const session = response.data.data.session;
      
      if (session) {
        setActiveSession(session);
        const elapsed = Math.floor((Date.now() - new Date(session.startedAt)) / 1000);
        setElapsedSeconds(elapsed);
      }
    } catch (error) {
      console.error('Failed to check active session:', error);
    }
  };

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleStart = async () => {
    try {
      const response = await api.post('/focus/start', {
        mode,
        project,
        plannedMinutes: parseInt(plannedMinutes),
      });
      
      setActiveSession(response.data.data.session);
      setElapsedSeconds(0);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to start session');
    }
  };

  const handleEnd = async () => {
    setShowEndForm(true);
  };

  const handleSubmitEnd = async (e) => {
    e.preventDefault();
    
    try {
      await api.post(`/focus/${activeSession._id}/end`, {
        rating: rating ? parseInt(rating) : undefined,
        note: note || undefined,
      });
      
      setActiveSession(null);
      setElapsedSeconds(0);
      setRating(null);
      setNote('');
      setShowEndForm(false);
      stopTimer();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to end session');
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

  if (showEndForm) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">End Focus Session</h2>
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-primary-600 mb-2">
            {formatTime(elapsedSeconds)}
          </div>
          <p className="text-gray-600">Great work! How was your session?</p>
        </div>

        <form onSubmit={handleSubmitEnd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate your focus (optional)
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className={`w-12 h-12 rounded-lg border-2 font-bold transition-all ${
                    rating === r
                      ? 'border-primary-600 bg-primary-600 text-white scale-110'
                      : 'border-gray-300 hover:border-primary-400 hover:scale-105'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you accomplish?"
              className="input resize-none"
              rows="3"
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1">
              Finish Session
            </button>
            <button
              type="button"
              onClick={() => setShowEndForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (activeSession) {
    const plannedSec = activeSession.plannedMinutes * 60;
    const progress = plannedSec > 0 ? Math.min((elapsedSeconds / plannedSec) * 100, 100) : 0;

    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Focus Session</h2>
        
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-primary-600 mb-4">
            {formatTime(elapsedSeconds)}
          </div>
          
          {activeSession.plannedMinutes && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Goal: {activeSession.plannedMinutes} minutes
              </p>
            </div>
          )}
          
          <div className="flex gap-2 justify-center text-sm">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              {activeSession.mode}
            </span>
            {activeSession.project && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {activeSession.project}
              </span>
            )}
          </div>
        </div>

        <button onClick={handleEnd} className="btn btn-danger w-full">
          End Session
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Start Focus Session</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="input">
              <option value="study">Study</option>
              <option value="coding">Coding</option>
              <option value="review">Review</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select value={project} onChange={(e) => setProject(e.target.value)} className="input">
              <option value="Personal">Personal</option>
              <option value="GA">GA</option>
              <option value="Poly">Poly</option>
              <option value="Oureon">Oureon</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Planned Duration (minutes)
          </label>
          <input
            type="number"
            value={plannedMinutes}
            onChange={(e) => setPlannedMinutes(e.target.value)}
            className="input"
            min="1"
            placeholder="25"
          />
          <div className="flex gap-2 mt-2">
            {[15, 25, 45, 60].map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setPlannedMinutes(min)}
                className="btn btn-secondary text-sm flex-1"
              >
                {min}m
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleStart} className="btn btn-primary w-full py-3 text-lg">
          🎯 Start Focus
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
