import React from 'react';

const Alert = ({ 
  type = 'error', // 'error' | 'success' | 'info' | 'warning'
  message,
  className = ''
}) => {
  const styles = {
    error: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
  };

  return message ? (
    <div className={`p-4 rounded-lg ${styles[type]} ${className}`}>
      {message}
    </div>
  ) : null;
};

export default Alert;