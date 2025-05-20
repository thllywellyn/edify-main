import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const PWAUpdateNotification = () => {
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('waiting', event => {
          if (event.target.state === 'waiting') {
            setWaitingWorker(registration.waiting);
            setShowReload(true);
            
            // Show update notification
            toast.custom(
              (t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
                  max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          New Update Available
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          A new version of Edify is available. Click to update.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-gray-200">
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        if (waitingWorker) {
                          waitingWorker.postMessage({ type: 'SKIP_WAITING' });
                          waitingWorker.addEventListener('statechange', e => {
                            if (e.target.state === 'activated') {
                              window.location.reload();
                            }
                          });
                        }
                      }}
                      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ),
              { duration: Infinity }
            );
          }
        });

        // Check for updates
        registration.addEventListener('controllerchange', () => {
          if (showReload) {
            window.location.reload();
          }
        });
      });
    }
  }, [showReload]);

  return null;
};

export default PWAUpdateNotification;
