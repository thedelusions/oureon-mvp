export const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        <p className="text-textMuted mt-4 text-sm">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
