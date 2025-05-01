import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ title, children, onClose }) => {
  console.log('Modal rendered with title:', title); // Debugging log

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#042439] rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;