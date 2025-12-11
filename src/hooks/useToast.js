import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'error', duration = 5000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showError = useCallback((message) => {
    return showToast(message, 'error', 5000);
  }, [showToast]);

  const showSuccess = useCallback((message) => {
    return showToast(message, 'success', 3000);
  }, [showToast]);

  const showInfo = useCallback((message) => {
    return showToast(message, 'info', 4000);
  }, [showToast]);

  return {
    toasts,
    showToast,
    showError,
    showSuccess,
    showInfo,
    removeToast,
  };
};

