import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { clsx } from 'clsx';

const Notification = () => {
  const { notification, showNotification } = useFinance();

  if (!notification) return null;

  const { message, type } = notification;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-primary-500" />,
  };

  const bgColors = {
    success: "bg-emerald-50/90 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-500/20",
    error: "bg-rose-50/90 dark:bg-rose-900/20 border-rose-100 dark:border-rose-500/20",
    info: "bg-primary-50/90 dark:bg-primary-900/20 border-primary-100 dark:border-primary-500/20",
  };

  return (
    <div className="fixed top-6 right-6 z-[100] pointer-events-none">
      <AnimatePresence mode="wait">
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={clsx(
              "pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-md min-w-[300px]",
              bgColors[type] || bgColors.info
            )}
          >
            <div className="shrink-0">
              {icons[type] || icons.info}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {message}
              </p>
            </div>
            <button 
              onClick={() => showNotification(null)}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Progress Bar */}
            <motion.div 
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              className={clsx(
                "absolute bottom-0 left-0 right-0 h-1 origin-left",
                type === 'success' && "bg-emerald-500",
                type === 'error' && "bg-rose-500",
                type === 'info' && "bg-primary-500"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
