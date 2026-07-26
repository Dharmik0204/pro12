import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border text-xs font-semibold transform transition-all duration-300 animate-slide-up ${
                isSuccess
                  ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700/50 backdrop-blur-md'
                  : isError
                  ? 'bg-rose-900/90 text-rose-100 border-rose-700/50 backdrop-blur-md'
                  : isWarning
                  ? 'bg-amber-900/90 text-amber-100 border-amber-700/50 backdrop-blur-md'
                  : 'bg-slate-900/90 text-slate-100 border-slate-700/50 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center space-x-3 pr-2">
                {isSuccess && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                {isError && <XCircle size={18} className="text-rose-400 shrink-0" />}
                {isWarning && <AlertTriangle size={18} className="text-amber-400 shrink-0" />}
                {!isSuccess && !isError && !isWarning && <Info size={18} className="text-blue-400 shrink-0" />}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
