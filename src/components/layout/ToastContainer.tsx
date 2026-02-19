import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  AlertTriangleIcon } from
'lucide-react';
import { useNavigation, type Toast } from '../../context/NavigationContext';
const toastConfig: Record<
  Toast['type'],
  {
    icon: React.ReactNode;
    bg: string;
    border: string;
    iconColor: string;
  }> =
{
  success: {
    icon: <CheckCircleIcon size={18} />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-600'
  },
  error: {
    icon: <AlertCircleIcon size={18} />,
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    iconColor: 'text-rose-600'
  },
  warning: {
    icon: <AlertTriangleIcon size={18} />,
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    iconColor: 'text-orange-600'
  },
  info: {
    icon: <InfoIcon size={18} />,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-600'
  }
};
export function ToastContainer() {
  const { toasts, removeToast } = useNavigation();
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite">

      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.95
              }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg ${config.bg} ${config.border} min-w-[320px] max-w-md`}
              role="alert">

              <span className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
                {config.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy-950">
                  {toast.title}
                </p>
                {toast.message &&
                <p className="text-xs text-slate-500 mt-0.5">
                    {toast.message}
                  </p>
                }
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Dismiss notification">

                <XIcon size={14} />
              </button>
            </motion.div>);

        })}
      </AnimatePresence>
    </div>);

}