import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import FocusTimer from '../components/FocusTimer';
import Summary from '../components/Summary';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks?scope=${activeTab}`);
      setTasks(response.data.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(tasks.filter((t) => t._id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Oureon</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name || user?.email}</p>
            </div>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary */}
            <Summary />

            {/* Focus Timer */}
            <FocusTimer />

            {/* Task Management */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('today')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'today'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setActiveTab('week')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'week'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              <TaskForm onTaskCreated={handleTaskCreated} />

              <div className="mt-6">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading tasks...</div>
                ) : (
                  <TaskList
                    tasks={tasks}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {tasks.filter((t) => t.completed).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium text-orange-600">
                    {tasks.filter((t) => !t.completed).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3">Projects</h3>
              <div className="space-y-2">
                {['GA', 'Poly', 'Oureon', 'Personal'].map((project) => (
                  <div
                    key={project}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-700">{project}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tasks.filter((t) => t.project === project).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
