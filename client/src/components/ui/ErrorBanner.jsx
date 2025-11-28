export const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <div>
            <p className="text-red-500 font-medium text-sm">{message}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBanner;
