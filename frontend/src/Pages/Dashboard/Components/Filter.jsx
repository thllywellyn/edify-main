import React, { useState } from 'react';
import Button from './Button';

const Filter = ({
  filters,
  onFilterChange,
  className = ''
}) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterKey, value) => {
    const newFilters = {
      ...activeFilters,
      [filterKey]: value
    };
    
    if (!value) {
      delete newFilters[filterKey];
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Filters
          </h3>
          {Object.keys(activeFilters).length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4E84C1] text-white">
              {Object.keys(activeFilters).length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {Object.keys(activeFilters).length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${isExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filters.map((filter) => (
          <div key={filter.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {filter.label}
            </label>
            {filter.type === 'select' && (
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-[#4E84C1] focus:border-[#4E84C1] sm:text-sm rounded-md bg-white dark:bg-[#042439] text-gray-900 dark:text-white"
              >
                <option value="">All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {filter.type === 'search' && (
              <input
                type="text"
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                placeholder={filter.placeholder}
                className="mt-1 block w-full px-3 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-[#4E84C1] focus:border-[#4E84C1] sm:text-sm rounded-md bg-white dark:bg-[#042439] text-gray-900 dark:text-white"
              />
            )}
            {filter.type === 'date' && (
              <input
                type="date"
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="mt-1 block w-full px-3 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-[#4E84C1] focus:border-[#4E84C1] sm:text-sm rounded-md bg-white dark:bg-[#042439] text-gray-900 dark:text-white"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;

// Example usage:
// const filters = [
//   {
//     key: 'status',
//     label: 'Status',
//     type: 'select',
//     options: [
//       { label: 'Active', value: 'active' },
//       { label: 'Inactive', value: 'inactive' }
//     ]
//   },
//   {
//     key: 'search',
//     label: 'Search',
//     type: 'search',
//     placeholder: 'Search by name...'
//   },
//   {
//     key: 'date',
//     label: 'Start Date',
//     type: 'date'
//   }
// ];
//
// <Filter
//   filters={filters}
//   onFilterChange={(filters) => {
//     console.log('Active filters:', filters);
//     // Apply filters to your data
//   }}
// />