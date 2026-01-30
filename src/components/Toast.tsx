import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 20 }}
            transition={{ duration: 0.3 }}
            onAnimationComplete={() => {
              if (toast.duration) {
                const timer = setTimeout(() => {
                  onRemove(toast.id);
                }, toast.duration);
                return () => clearTimeout(timer);
              }
            }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-cyber text-sm backdrop-blur-sm ${
              toast.type === 'success'
                ? 'bg-green-900/80 border border-green-500 text-green-100'
                : toast.type === 'error'
                  ? 'bg-red-900/80 border border-red-500 text-red-100'
                  : 'bg-blue-900/80 border border-blue-500 text-blue-100'
            }`}
          >
            {toast.type === 'success' && (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
