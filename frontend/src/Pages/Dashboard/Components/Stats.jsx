import React from 'react';
import Card from './Card';

const Stats = ({
  icon: Icon,
  label,
  value,
  onClick,
  className = '',
  valuePrefix = '',
  valueSuffix = ''
}) => {
  return (
    <Card onClick={onClick} hover={!!onClick} className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {valuePrefix}{value}{valueSuffix}
          </h3>
        </div>
        {Icon && (
          <div className="p-3 bg-[#4E84C1]/10 rounded-lg">
            <Icon className="h-6 w-6 text-[#4E84C1]" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default Stats;