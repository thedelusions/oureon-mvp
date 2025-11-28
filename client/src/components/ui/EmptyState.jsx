export const EmptyState = ({ 
  icon = '📭',
  title,
  description,
  action
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="heading-3 mb-2">{title}</h3>
      {description && <p className="text-body mb-6">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
