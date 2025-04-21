import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({
  type = 'info', // 'success' | 'error' | 'info'
  message,
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    info: FaInfoCircle
  };

  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400',
    error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
  };

  const Icon = icons[type];

  return createPortal(
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`flex items-center p-4 rounded-lg shadow-lg ${styles[type]}`}>
        <Icon className="h-5 w-5 mr-3" />
        <p className="mr-3">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};

// Helper function to manage multiple toasts
const toastManager = {
  toasts: new Set(),
  listeners: new Set(),

  show(options) {
    const id = Math.random().toString(36).substr(2, 9);
    this.toasts.add({ id, ...options });
    this.notifyListeners();
    return id;
  },

  hide(id) {
    this.toasts = new Set([...this.toasts].filter(toast => toast.id !== id));
    this.notifyListeners();
  },

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.toasts));
  }
};

export { Toast, toastManager };

// Example usage:
// import { toastManager } from './Toast';
// 
// toastManager.show({
//   type: 'success',
//   message: 'Changes saved successfully!',
//   duration: 3000
// });