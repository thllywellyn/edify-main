import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showClose = true,
  className = ''
}) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div
          className={`
            relative transform rounded-lg bg-white dark:bg-[#0a3553] text-left shadow-xl transition-all w-full
            ${sizes[size]}
            ${className}
          `}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {showClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.Footer = function ModalFooter({ children, className = '' }) {
  return (
    <div
      className={`
        px-6 py-4 border-t border-gray-200 dark:border-gray-700
        flex items-center justify-end space-x-2
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Modal;

// Example usage:
// const [isOpen, setIsOpen] = useState(false);
// 
// <Modal
//   isOpen={isOpen}
//   onClose={() => setIsOpen(false)}
//   title="Confirm Action"
//   size="md"
// >
//   <p>Are you sure you want to proceed?</p>
//   <Modal.Footer>
//     <Button variant="outline" onClick={() => setIsOpen(false)}>
//       Cancel
//     </Button>
//     <Button onClick={handleConfirm}>
//       Confirm
//     </Button>
//   </Modal.Footer>
// </Modal>