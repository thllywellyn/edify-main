import React from 'react';

const Loading = ({ 
  size = 'md', // 'sm' | 'md' | 'lg'
  center = false,
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const Spinner = (
    <div className={`animate-spin rounded-full border-b-2 border-[#4E84C1] ${sizes[size]} ${className}`} />
  );

  if (center) {
    return (
      <div className="flex items-center justify-center p-4">
        {Spinner}
      </div>
    );
  }

  return Spinner;
};

export default Loading;