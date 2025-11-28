export const Input = ({ 
  label,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;
