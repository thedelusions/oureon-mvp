import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Loading,
  EmptyState,
  ErrorBanner,
} from '../components/ui';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scope, setScope] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: 'Personal',
    type: 'Task',
    deadline: '',
  });

  const projects = ['Personal', 'Work', 'Study', 'Health', 'Other'];
  const types = ['Task', 'Meeting', 'Email', 'Call', 'Review'];

  useEffect(() => {
    fetchTasks();
  }, [scope, selectedProject]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (scope !== 'all') params.append('scope', scope);
      if (selectedProject !== 'all') params.append('project', selectedProject);

      const response = await api.get(`/tasks?${params}`);
      setTasks(response.data.data.tasks);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      setShowModal(false);
      setEditingTask(null);
      resetForm();
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      project: task.project,
      type: task.type,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      project: 'Personal',
      type: 'Task',
      deadline: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    resetForm();
  };

  const filteredTasks = tasks.filter((task) => {
    if (scope === 'completed') return task.completed;
    if (scope === 'active') return !task.completed;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-1 mb-2">Tasks</h1>
          <p className="text-textMuted">Manage your tasks and deadlines</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Task
        </Button>
      </div>

      {error && <ErrorBanner message={error} onClose={() => setError('')} />}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex gap-2 bg-surface rounded-lg p-1">
          <button
            onClick={() => setScope('all')}
            className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
              scope === 'all'
                ? 'bg-accent text-white'
                : 'text-textMuted hover:text-textPrimary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setScope('today')}
            className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
              scope === 'today'
                ? 'bg-accent text-white'
                : 'text-textMuted hover:text-textPrimary'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setScope('week')}
            className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
              scope === 'week'
                ? 'bg-accent text-white'
                : 'text-textMuted hover:text-textPrimary'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setScope('completed')}
            className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
              scope === 'completed'
                ? 'bg-accent text-white'
                : 'text-textMuted hover:text-textPrimary'
            }`}
          >
            Completed
          </button>
        </div>

        <Select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          options={[
            { value: 'all', label: 'All Projects' },
            ...projects.map((p) => ({ value: p, label: p })),
          ]}
          className="w-48"
        />
      </div>

      {/* Tasks List */}
      {loading ? (
        <Loading text="Loading tasks..." />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No tasks found"
          description={
            scope === 'all'
              ? 'Create your first task to get started'
              : `No tasks ${scope === 'completed' ? 'completed' : `for ${scope}`}`
          }
          action={
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add Task
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredTasks.map((task) => (
            <Card key={task._id} interactive>
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task._id)}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-surface text-accent focus:ring-2 focus:ring-accent cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-semibold mb-1 ${
                      task.completed
                        ? 'line-through text-textMuted'
                        : 'text-textPrimary'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-textMuted text-sm mb-3">{task.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                      {task.project}
                    </span>
                    <span className="text-xs px-2 py-1 bg-white/10 text-textMuted rounded">
                      {task.type}
                    </span>
                    {task.deadline && (
                      <span className="text-xs px-2 py-1 bg-white/10 text-textMuted rounded">
                        📅 {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleEdit(task)}
                    className="text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(task._id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-2">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-textMuted hover:text-textPrimary text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter task title"
              />

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add a description (optional)"
                rows={3}
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

              <Select
                label="Type"
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                options={types.map((t) => ({ value: t, label: t }))}
              />

              <Input
                label="Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
