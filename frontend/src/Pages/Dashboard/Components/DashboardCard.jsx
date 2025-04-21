import React from 'react';

// Common card component for dashboard UI consistency
const DashboardCard = ({ 
  children, 
  className = "", 
  noPadding = false,
  onClick = null,
  hover = true 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white dark:bg-[#0a3553] rounded-lg shadow-sm
        ${hover ? 'hover:shadow-md transition-shadow' : ''}
        ${!noPadding ? 'p-6' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
};

export default DashboardCard;