import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const PageHeader = ({
  title,
  description,
  backTo,
  action,
  actionLabel,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          {backTo && (
            <Link
              to={backTo}
              className="inline-flex items-center text-sm font-medium text-[#4E84C1] hover:text-[#3a6da3] mb-2"
            >
              ← Back
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {action && actionLabel && (
          <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-4">
            <Button onClick={action}>{actionLabel}</Button>
          </div>
        )}
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700" />
    </div>
  );
};

export default PageHeader;