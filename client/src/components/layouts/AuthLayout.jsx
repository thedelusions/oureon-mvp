export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-textPrimary mb-2">Oureon</h1>
          <p className="text-textMuted">Focus & Productivity Platform</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
