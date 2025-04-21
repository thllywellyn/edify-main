import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Menu = ({ 
  trigger,
  children,
  align = 'right', // 'left' | 'right'
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0a3553] border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-[#042439] focus:outline-none">
            Options
            <FaChevronDown className="-mr-1 ml-2 h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={`absolute z-10 mt-2 w-56 rounded-md bg-white dark:bg-[#0a3553] shadow-lg ring-1 ring-black ring-opacity-5 ${
          align === 'right' ? 'right-0' : 'left-0'
        }`}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

Menu.Item = function MenuItem({ 
  onClick,
  children,
  disabled = false,
  variant = 'default' // 'default' | 'danger'
}) {
  const baseStyles = 'block w-full text-left px-4 py-2 text-sm';
  const variants = {
    default: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#042439]',
    danger: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
  };
  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${disabled ? disabledStyles : ''}
      `.trim()}
      role="menuitem"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Menu;