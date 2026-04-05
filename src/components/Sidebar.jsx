import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  PlusCircle, 
  Settings, 
  Shield, 
  Sun, 
  Moon,
  ChevronDown
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, onAddClick }) => {
  const { role, setRole, theme, setTheme, currency, setCurrency, CURRENCIES } = useFinance();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'insights', label: 'Insights', icon: PieChart },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-white/5 w-64 p-6 transition-all duration-300">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
          <Receipt className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold dark:text-white">FinanceHub</h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "sidebar-link group",
                isActive && "sidebar-link-active"
              )}
            >
              <Icon className={clsx(
                "w-5 h-5",
                isActive ? "text-white" : "group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400"
              )} />
              {item.label}
            </button>
          );
        })}
        
      </nav>

      <div className="pt-6 border-t border-gray-200 dark:border-white/5 flex flex-col gap-4">
        {/* Mobile Currency Selector */}
        <div className="lg:hidden flex flex-col gap-3">
          <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1 font-poppins">
            Display Currency
          </label>
          <div className="relative flex p-1.5 bg-gray-100 dark:bg-slate-800/80 rounded-2xl border border-gray-200/50 dark:border-white/5">
            {Object.keys(CURRENCIES).map((code) => (
              <motion.button
                key={code}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrency(code)}
                className={clsx(
                  "flex-1 relative flex items-center justify-center py-2.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 z-10",
                  currency === code 
                    ? "text-primary-600 dark:text-primary-400" 
                    : "text-gray-400 hover:text-gray-700 dark:hover:text-slate-200"
                )}
              >
                {currency === code && (
                  <motion.div
                    layoutId="activeCurrencyMobile"
                    className="absolute inset-0 bg-white dark:bg-slate-700 shadow-xl shadow-black/5 rounded-xl border border-gray-100 dark:border-white/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{CURRENCIES[code].symbol} {code}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Role Toggle */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
            Access Control
          </label>
          <div className="flex p-1.5 bg-gray-100 dark:bg-slate-800/50 rounded-2xl border border-gray-200/50 dark:border-white/5">
            <button
              onClick={() => setRole('admin')}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all capitalize",
                role === 'admin' 
                  ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" 
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
            <button
              onClick={() => setRole('viewer')}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all capitalize",
                role === 'viewer' 
                  ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" 
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              Viewer
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/30 border border-gray-200/50 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all text-sm font-bold text-gray-700 dark:text-slate-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary-400" />}
                </motion.div>
              </AnimatePresence>
            </div>
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
