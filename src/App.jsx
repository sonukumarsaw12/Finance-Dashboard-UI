import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatCards from './components/Dashboard/StatCards';
import Charts from './components/Dashboard/Charts';
import TransactionList from './components/Transactions/TransactionList';
import TransactionModal from './components/Transactions/TransactionModal';
import InsightsPanel from './components/Dashboard/InsightsPanel';
import Notification from './components/ui/Notification';
import { useFinance } from './context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, Menu, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

// Premium Confirmation Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden"
        >
          {/* Background Decorative Gradient */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-rose-500/10 dark:bg-rose-500/5 blur-3xl rounded-full" />

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2 uppercase tracking-tight">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-medium mb-8">
              {message}
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// Dynamic Welcome Greeting with Cycling Typewriter & Erase Effect
const WelcomeGreeting = () => {
  const [index, setIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [typingSpeed, setTypingSpeed] = React.useState(100);

  const messages = [
    { text: "Here's what's happening with your finances today.", highlights: ["finances", "today."] },
    { text: "Your savings have increased by 12% this month!", highlights: ["savings", "12%"] },
    { text: "Smart Tip: Review your 'Food' budget to save more.", highlights: ["Tip:", "save"] },
    { text: "You have 3 new financial insights to review.", highlights: ["insights", "review."] },
    { text: "Ready to reach your monthly financial goals, Sonu?", highlights: ["goals,", "Sonu?"] }
  ];

  React.useEffect(() => {
    let timer;
    const currentFullText = messages[index].text;

    if (!isDeleting && displayText === currentFullText) {
      // Pause before starting to delete
      timer = setTimeout(() => setIsDeleting(true), 3000);
    } else if (isDeleting && displayText === "") {
      // Move to next message and start typing
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % messages.length);
    } else {
      // Handle Typing or Deleting
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentFullText.substring(0, displayText.length - 1)
          : currentFullText.substring(0, displayText.length + 1);

        setDisplayText(nextText);
        setTypingSpeed(isDeleting ? 40 : 80);
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index]);

  const currentMessage = messages[index];

  return (
    <div className="mb-4 min-h-[80px] md:min-h-[90px]">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-4xl font-black dark:text-white mb-2 tracking-tight font-poppins"
      >
        Welcome Back, Sonu! 👋
      </motion.h2>
      <div className="min-h-[3rem] md:min-h-[2.5rem] max-w-xl">
        {displayText.split(" ").map((word, wordIdx, wordsArr) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.3em]">
            {word.split("").map((char, charIdx) => {
              // Calculate global index
              const charGlobalIdx = wordsArr.slice(0, wordIdx).join(" ").length + (wordIdx > 0 ? 1 : 0) + charIdx;
              
              const isHighlighted = currentMessage.highlights.some(highlight => {
                const startIdx = currentMessage.text.indexOf(highlight);
                return charGlobalIdx >= startIdx && charGlobalIdx < startIdx + highlight.length;
              });

              return (
                <motion.span
                  key={charIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={clsx(
                    "text-gray-500 dark:text-slate-400 font-semibold text-xs md:text-base transition-colors",
                    isHighlighted && "text-primary-600 dark:text-primary-400 font-black"
                  )}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
        {/* Animated Typing Cursor */}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1 h-4 md:w-1.5 md:h-5 bg-primary-500 rounded-full align-middle ml-1"
        />
      </div>
    </div>
  );
};

const App = () => {
  const { summary, role, setRole, currency, setCurrency, CURRENCIES, dispatch, showNotification } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    onConfirm: () => { },
    title: '',
    message: ''
  });

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const triggerConfirm = (config) => {
    setConfirmModal({
      ...config,
      isOpen: true
    });
  };

  const handleSaveTransaction = (transactionData) => {
    if (editingTransaction) {
      dispatch({ 
        type: 'EDIT_TRANSACTION', 
        payload: { ...transactionData, id: editingTransaction.id } 
      });
      showNotification('Transaction updated successfully');
    } else {
      dispatch({ 
        type: 'ADD_TRANSACTION', 
        payload: { ...transactionData, id: Date.now().toString() } 
      });
      showNotification('Transaction added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    triggerConfirm({
      title: 'Delete Transaction',
      message: 'Are you sure you want to permanently remove this transaction?',
      onConfirm: () => {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
        showNotification('Transaction deleted', 'error');
        setIsModalOpen(false);
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
          onAddClick={handleAdd}
          onLogout={() => showNotification('Logged out successfully', 'info')}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 flex items-center justify-between px-6 bg-white/70 dark:bg-slate-900/70 border-b border-gray-200 dark:border-white/5 backdrop-blur-xl sticky top-0 z-30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
              <span className="hover:text-primary-600 transition-colors cursor-pointer">{activeTab}</span>
              <span className="opacity-30">/</span>
              <span className="text-gray-900 dark:text-white">Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Currency Toggle — Segmented Control */}
            <div className="hidden sm:flex relative group p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-white/5">
              {Object.keys(CURRENCIES).map((code) => (
                <motion.button
                  key={code}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrency(code)}
                  className={clsx(
                    "relative px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10",
                    currency === code 
                      ? "text-primary-600 dark:text-primary-400" 
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                  )}
                >
                  {currency === code && (
                    <motion.div
                      layoutId="activeCurrency"
                      className="absolute inset-0 bg-white dark:bg-slate-700 shadow-sm rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{CURRENCIES[code].symbol} {code}</span>
                </motion.button>
              ))}
            </div>

            {/* Interactive Header Role Switcher */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
              className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-primary-50 dark:bg-primary-900/20 rounded-2xl px-3 sm:px-5 border border-primary-100 dark:border-primary-900/30 group transition-all hover:bg-primary-100/50 dark:hover:bg-primary-900/40 shadow-sm"
            >
              <div className="relative">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20" />
              </div>
              <span className="text-[9px] sm:text-xs font-black text-primary-700 dark:text-primary-400 uppercase tracking-tight">
                {role}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500/50 group-hover:text-primary-500 transition-colors" />
            </motion.button>

            <button className="relative p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold dark:text-white leading-none mb-0.5">Sonu Kumar</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{role === 'admin' ? 'Finance Manager' : 'Guest Viewer'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-violet-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform group-hover:scale-105">
                SK
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar scroll-smooth bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-6xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <WelcomeGreeting />

                  <StatCards summary={summary} />
                  <Charts />
                </motion.div>
              )}

              {activeTab === 'transactions' && (
                <motion.div
                  key="transactions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <div>
                      <h2 className="text-2xl font-bold dark:text-white mb-2">Transactions</h2>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">Keep track and manage your financial activity.</p>
                    </div>
                    {role === 'admin' && (
                      <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-600/20 transition-all active:scale-95"
                      >
                        Add Transaction
                      </button>
                    )}
                  </div>
                  <TransactionList onEdit={handleEdit} onConfirmRequired={triggerConfirm} />
                </motion.div>
              )}

              {activeTab === 'insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold dark:text-white mb-2">Financial Insights</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Smart analysis of your spending habits and savings.</p>
                  </div>
                  <InsightsPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
        editingTransaction={editingTransaction}
      />

      {/* Global Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />

      {/* Global Notification system */}
      <Notification />
    </div>
  );
};

export default App;
