import { createContext, useContext, useCallback } from 'react';
import { message } from 'antd';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const showError = useCallback((msg) => {
    message.error(msg, 5);
  }, []);

  const showSuccess = useCallback((msg) => {
    message.success(msg, 3);
  }, []);

  const showInfo = useCallback((msg) => {
    message.info(msg, 4);
  }, []);

  const showWarning = useCallback((msg) => {
    message.warning(msg, 4);
  }, []);

  return (
    <ToastContext.Provider value={{ showError, showSuccess, showInfo, showWarning }}>
      {children}
    </ToastContext.Provider>
  );
};

