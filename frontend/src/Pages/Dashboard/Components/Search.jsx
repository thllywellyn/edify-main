import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const Search = ({
  placeholder = 'Search...',
  onSearch,
  className = '',
  debounceMs = 300
}) => {
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Clear existing timer
    if (timer) {
      clearTimeout(timer);
    }

    // Set new timer for debounce
    const newTimer = setTimeout(() => {
      onSearch(newValue);
    }, debounceMs);

    setTimer(newTimer);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="block w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#042439] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4E84C1]"
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Search;