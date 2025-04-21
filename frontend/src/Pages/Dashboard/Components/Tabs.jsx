import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Tabs = ({ tabs, className = '' }) => {
  const location = useLocation();

  return (
    <div className={className}>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`
                  whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                  ${isActive
                    ? 'border-[#4E84C1] text-[#4E84C1]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {tab.icon && (
                  <tab.icon className={`inline-block h-4 w-4 mr-2 ${
                    isActive ? 'text-[#4E84C1]' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                )}
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isActive
                      ? 'bg-[#4E84C1]/10 text-[#4E84C1]'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// Example usage:
// const tabs = [
//   { label: 'Overview', to: '/dashboard/overview', icon: FaHome },
//   { label: 'Classes', to: '/dashboard/classes', icon: FaCalendar, count: 5 },
//   { label: 'Students', to: '/dashboard/students', icon: FaUsers },
// ];

export default Tabs;