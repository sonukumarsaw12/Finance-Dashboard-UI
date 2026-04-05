import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, DollarSign, Tag, FileText, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import CustomDropdown from '../ui/CustomDropdown';

const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', color: '#10b981' },
  { id: 'freelance', name: 'Freelance', color: '#3b82f6' },
  { id: 'bonus', name: 'Bonus', color: '#f59e0b' },
  { id: 'investments', name: 'Investments', color: '#8b5cf6' },
  { id: 'gift', name: 'Gift', color: '#ec4899' },
  { id: 'side_hustle', name: 'Side Hustle', color: '#4f46e5' },
  { id: 'other_income', name: 'Other Income', color: '#64748b' }
];

const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#f59e0b' },
  { id: 'rent', name: 'Rent & Housing', color: '#6366f1' },
  { id: 'entertainment', name: 'Entertainment', color: '#8b5cf6' },
  { id: 'utilities', name: 'Utilities', color: '#ef4444' },
  { id: 'shopping', name: 'Shopping', color: '#ec4899' },
  { id: 'transport', name: 'Transport', color: '#4f46e5' },
  { id: 'other', name: 'Other', color: '#94a3b8' }
];

const getCurrencySymbol = () => {
    const currency = localStorage.getItem('finance_currency') || 'USD';
    switch (currency) {
        case 'INR': return '₹';
        case 'EUR': return '€';
        case 'GBP': return '£';
        default: return '$';
    }
};

const TransactionModal = ({ isOpen, onClose, onAdd, editingTransaction = null, onDelete = null }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'income',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        amount: Math.abs(editingTransaction.amount).toString()
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        type: 'income',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setErrors({});
  }, [editingTransaction, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = 'Valid amount is required';
    if (!formData.category) newErrors.category = 'Category is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      ...formData,
      amount: Math.abs(Number(formData.amount))
    });
    onClose();
  };

  const isIncome = formData.type === 'income';
  const activeCategories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Handle type change and reset category
  const handleTypeChange = (newType) => {
    setFormData({ 
      ...formData, 
      type: newType, 
      category: '' // Reset category when switching type to avoid mix-match
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[28px] shadow-premium border border-gray-100 dark:border-white/5 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className={clsx(
              "shrink-0 relative px-6 py-6 md:px-10 md:py-8 transition-colors duration-500 border-b border-gray-50 dark:border-white/5",
              isIncome ? "bg-emerald-50/30 dark:bg-emerald-500/5" : "bg-primary-50/30 dark:bg-primary-500/5"
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {editingTransaction ? 'Edit' : 'New'} <span className={isIncome ? "text-emerald-500" : "text-primary-500"}>Transaction</span>
                  </h2>
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1 opacity-80">
                    Add new entry to ledger
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-white/5 text-gray-400 hover:text-rose-500 transition-all hover:scale-110 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 md:px-10 md:pb-12 space-y-6 md:space-y-8 no-scrollbar">
              {/* Type Toggle */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] px-2">Type</label>
                <div className="flex p-1.5 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-white/5 relative">
                  {(['income', 'expense']).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={clsx(
                        "relative flex-1 py-3 px-4 text-xs font-black uppercase tracking-widest transition-all duration-500 rounded-xl z-10",
                        formData.type === type ? "text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      )}
                    >
                      {type === formData.type && (
                        <motion.div
                          layoutId="activeType"
                          className={clsx("absolute inset-0 rounded-xl shadow-lg", type === 'income' ? "bg-emerald-500" : "bg-primary-500")}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {/* Description */}
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] px-2">Description</label>
                  <input
                    type="text"
                    placeholder={isIncome ? "e.g. Monthly Salary" : "e.g. Monthly Rent Payment"}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={clsx(
                      "w-full bg-gray-100/60 dark:bg-slate-800/60 border rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 transition-all dark:text-white placeholder:text-gray-400",
                      errors.description ? "border-rose-500 ring-rose-500/10" : "border-gray-100 dark:border-white/10 focus:border-primary-500 focus:ring-primary-500/10"
                    )}
                  />
                </div>

                {/* Category */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] px-2">Category</label>
                  <CustomDropdown
                    options={activeCategories}
                    value={formData.category}
                    onChange={(val) => setFormData({ ...formData, category: val })}
                    variant="input"
                    className="w-full"
                  />
                </div>

                {/* Date */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] px-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-gray-100/60 dark:bg-slate-800/60 border border-gray-100 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] px-2">Amount ({getCurrencySymbol()})</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={clsx(
                      "w-full bg-gray-100/60 dark:bg-slate-800/60 border rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 transition-all dark:text-white placeholder:text-gray-400",
                      errors.amount ? "border-rose-500 ring-rose-500/10" : "border-gray-100 dark:border-white/10 focus:border-primary-500 focus:ring-primary-500/10"
                    )}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.25em] px-2">Notes</label>
                  <input
                    type="text"
                    placeholder="Optional memo..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-gray-100/60 dark:bg-slate-800/60 border border-gray-100 dark:border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-2">
                {editingTransaction && onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(editingTransaction.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 text-rose-500 font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  className={clsx(
                    "flex-[2] flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-black uppercase text-[11px] tracking-widest transition-all shadow-lg active:scale-95",
                    isIncome 
                      ? "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600" 
                      : "bg-primary-500 shadow-primary-500/20 hover:bg-primary-600"
                  )}
                >
                  {editingTransaction ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingTransaction ? 'Update' : 'Add'} Record
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
