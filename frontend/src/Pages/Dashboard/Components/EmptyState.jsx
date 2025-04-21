import React from 'react';
import Card from './Card';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className = ''
}) => {
  return (
    <Card className={`text-center py-12 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {Icon && (
          <div className="p-3 bg-gray-50 dark:bg-[#042439] rounded-full">
            <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        {title && (
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            {description}
          </p>
        )}

        {action && actionLabel && (
          <Button onClick={action} variant="primary" size="md" className="mt-4">
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EmptyState;