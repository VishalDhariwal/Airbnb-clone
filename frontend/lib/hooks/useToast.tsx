"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toastVariants } from "@/lib/motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack — bottom-left on desktop, above the mobile bottom nav (§7.8) */}
      <div className="pointer-events-none fixed bottom-20 left-1/2 z-[70] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4 sm:bottom-6 sm:left-6 sm:translate-x-0 sm:items-start sm:px-0">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="status"
              aria-live="polite"
              className="pointer-events-auto flex w-full items-center gap-3 rounded-lg bg-ink px-4 py-3.5 t-body-sm text-white shadow-card"
            >
              {toast.type === "success" && (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
              )}
              {toast.type === "info" && (
                <Info className="h-4 w-4 flex-shrink-0 text-sky-400" />
              )}

              <span className="flex-1 leading-snug">{toast.message}</span>

              <button
                onClick={() => removeToast(toast.id)}
                className="rounded p-0.5 text-white/60 transition-colors duration-150 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
