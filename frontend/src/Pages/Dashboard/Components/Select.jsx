import React from 'react';

const Select = ({
  label,
  error,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-[#042439] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4E84C1] ${
          error ? 'border-red-500 dark:border-red-500' : ''
        } ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;