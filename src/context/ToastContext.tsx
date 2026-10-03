'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  showToast: (title: string, type?: ToastType, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, type: ToastType = 'success', description?: string) => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const newToast: ToastMessage = { id, type, title, description };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container (Top Right Position) */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-950/50'
                : 'bg-cyan-950/90 border-cyan-500/40 text-cyan-100 shadow-cyan-950/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold leading-snug">{toast.title}</h4>
                {toast.description && (
                  <p className="text-[11px] opacity-80 font-light leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
