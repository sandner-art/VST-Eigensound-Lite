import React from 'react';

const IconButton = ({ children, onClick, size = 'md' }) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-3',
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        bg-gray-700/50 text-cyan-400 rounded-full 
        hover:bg-cyan-500/30 hover:text-cyan-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500
        transition-all duration-200 ease-in-out
      `}
    >
      {children}
    </button>
  );
};

export default IconButton;
