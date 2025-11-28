import { useState } from 'react';
import api from '../utils/api';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    try {
      await api.patch(`/tasks/${task._id}/complete`);
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.patch(`/tasks/${task._id}`, { title, description });
      onTaskUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${task._id}`);
      onTaskDeleted(task._id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditing) {
    return (
      <div className="border-2 border-primary-200 rounded-lg p-3 bg-primary-50">
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input mb-2"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input mb-2 resize-none"
            rows="2"
            placeholder="Description"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn btn-primary text-sm">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
        task.completed ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggleComplete}
          className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
        />

        <div className="flex-1">
          <h3
            className={`font-medium ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {task.project}
            </span>
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
              {task.type}
            </span>
            {task.deadline && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  new Date(task.deadline) < new Date()
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                📅 {formatDate(task.deadline)}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No tasks yet</p>
        <p className="text-sm mt-1">Create your first task to get started!</p>
      </div>
    );
  }

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-4">
      {incompleteTasks.length > 0 && (
        <div className="space-y-3">
          {incompleteTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
            />
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900">
            Completed ({completedTasks.length})
          </summary>
          <div className="space-y-3 mt-3">
            {completedTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onTaskUpdated={onTaskUpdated}
                onTaskDeleted={onTaskDeleted}
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default TaskList;
