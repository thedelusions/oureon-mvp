import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/app/tasks', label: 'Tasks', icon: '✓' },
    { path: '/app/focus', label: 'Focus', icon: '🎯' },
    { path: '/app/summary', label: 'Summary', icon: '📈' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-surface border-r border-white/5 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold text-textPrimary">Oureon</h1>
        <p className="text-xs text-textMuted mt-1">Focus Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent text-white shadow-lg shadow-accent/20'
                      : 'text-textMuted hover:text-textPrimary hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg mb-2">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-textPrimary truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-textMuted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full btn-secondary text-sm py-2"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
