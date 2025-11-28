export const Card = ({ 
  children, 
  interactive = false,
  className = '',
  onClick,
  ...props 
}) => {
  return (
    <div
      onClick={onClick}
      className={`${interactive ? 'card-interactive' : 'card'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
