import { useState } from 'react';
import api from '../utils/api';

const TaskForm = ({ onTaskCreated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('Personal');
  const [type, setType] = useState('study');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setProject('Personal');
    setType('study');
    setDeadline('');
    setIsExpanded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const taskData = {
        title,
        description,
        project,
        type,
      };

      if (deadline) {
        taskData.deadline = new Date(deadline).toISOString();
      }

      const response = await api.post('/tasks', taskData);
      onTaskCreated(response.data.data.task);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
      >
        + Add New Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-primary-200 rounded-lg p-4 bg-primary-50">
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="input mb-3"
        required
        autoFocus
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="input mb-3 resize-none"
        rows="2"
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Project</label>
          <select value={project} onChange={(e) => setProject(e.target.value)} className="input">
            <option value="Personal">Personal</option>
            <option value="GA">GA</option>
            <option value="Poly">Poly</option>
            <option value="Oureon">Oureon</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input">
            <option value="study">Study</option>
            <option value="code">Code</option>
            <option value="admin">Admin</option>
            <option value="life">Life</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">Deadline (optional)</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="input"
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn btn-primary flex-1">
          {loading ? 'Creating...' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
