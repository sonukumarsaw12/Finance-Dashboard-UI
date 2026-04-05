import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  label = 'Select Option', 
  icon: Icon,
  variant = 'filter', // 'filter' or 'input'
  direction = 'down', // 'down' or 'up'
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionId) => {
    onChange(optionId);
    setIsOpen(false);
  };

  const isFilter = variant === 'filter';
  const isUp = direction === 'up';

  return (
    <div className={clsx("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full flex items-center justify-between gap-3 px-4 transition-all duration-500 shadow-sm outline-none",
          isFilter
            ? "bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl py-3 text-xs md:text-[13px] font-bold dark:text-white tracking-tight"
            : "bg-gray-100/60 dark:bg-slate-800/60 border border-gray-100 dark:border-white/10 rounded-[12px] md:rounded-2xl py-3 md:py-4.5 px-5 md:px-6 text-sm font-bold dark:text-gray-100 tracking-tight",
          isOpen && (
            isFilter 
              ? "ring-4 ring-primary-500/15 border-primary-500 shadow-lg scale-[1.01]" 
              : "ring-4 ring-primary-500/10 border-primary-500 shadow-xl shadow-primary-500/5 scale-[1.01]"
          )
        )}
      >
        <div className="flex items-center gap-3 truncate">
          {Icon && <Icon className={clsx("w-4 h-4 transition-colors", isOpen ? "text-primary-500" : "text-gray-400")} />}
          {selectedOption ? (
            <div className="flex items-center gap-2.5 truncate">
              {selectedOption.color && (
                <div 
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_12px_rgba(0,0,0,0.15)] ring-2 ring-white dark:ring-slate-800" 
                  style={{ backgroundColor: selectedOption.color }} 
                />
              )}
              <span className="truncate font-black uppercase text-[10px] md:text-[11px] tracking-widest">{selectedOption.name}</span>
            </div>
          ) : (
            <span className="text-gray-400 dark:text-slate-500 font-black uppercase text-[10px] md:text-[11px] tracking-widest">{label}</span>
          )}
        </div>
        <ChevronDown 
          className={clsx(
            "w-4 h-4 text-gray-400 transition-all duration-500 shrink-0",
            isOpen && "rotate-180 text-primary-500 scale-110"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Overlay */}
            <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: isUp ? -15 : 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isUp ? -10 : 10, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={clsx(
                "absolute z-50 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-floating glass-stroke overflow-hidden",
                isUp ? "bottom-full mb-3 origin-bottom" : "top-full mt-3 origin-top"
              )}
            >
              <div className="max-h-48 overflow-y-auto no-scrollbar py-2">
                <AnimatePresence mode="popLayout">
                  {options.length > 0 ? (
                    options.map((option) => (
                      <motion.button
                        layout
                        key={option.id}
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => handleSelect(option.id)}
                        className={clsx(
                          "w-full flex items-center justify-between px-5 py-3.5 text-left transition-all group relative",
                          value === option.id 
                            ? "bg-primary-50/80 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400" 
                            : "text-gray-600 dark:text-slate-300 hover:bg-gray-50/50 dark:hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3.5">
                          {option.color && (
                            <div 
                              className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white/50 dark:ring-slate-800/50 group-hover:scale-125 transition-transform duration-300" 
                              style={{ backgroundColor: option.color }} 
                            />
                          )}
                          <span className={clsx(
                            "text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                            value === option.id ? "translate-x-1" : "group-hover:translate-x-1"
                          )}>
                            {option.name}
                          </span>
                        </div>
                        {value === option.id && (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                          >
                            <Check className="w-4 h-4 text-primary-500 stroke-[3]" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))
                  ) : (
                    <div className="p-10 text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                        No options available
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
