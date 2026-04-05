import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  TrendingDown,
  TrendingUp,
  Download,
  Calendar,
  XCircle,
  PlusCircle,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown
} from 'lucide-react';
import CustomDropdown from '../ui/CustomDropdown';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../utils/mockData';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const SummaryCard = ({ label, amount, icon: Icon, colorClass }) => {
  const { formatAmount } = useFinance();
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-[16px] border border-gray-100 dark:border-white/5 flex items-center gap-4 shadow-premium">
      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1 font-poppins">{label}</p>
        <p className="text-sm premium-number dark:text-white leading-none">
          {label.toLowerCase().includes('expense') && '-'}{formatAmount(amount)}
        </p>
      </div>
    </div>
  );
};

const TransactionList = ({ onEdit, onConfirmRequired }) => {
  const {
    filteredTransactions,
    filteredSummary,
    role,
    dispatch,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    formatAmount,
    showNotification
  } = useFinance();

  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'amount') return (a.amount - b.amount) * factor;
    if (sortField === 'date') return (new Date(a.date) - new Date(b.date)) * factor;
    return a.description.localeCompare(b.description) * factor;
  });

  const handleDelete = (id) => {
    onConfirmRequired({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this transaction? This action cannot be undone.',
      onConfirm: () => {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
        showNotification('Transaction deleted successfully', 'success');
      }
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterType('all');
    setStartDate('');
    setEndDate('');
  };

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(sortedTransactions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions_export.json';
    link.click();
    setShowExportMenu(false);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = sortedTransactions.map(t => {
      const categoryObj = CATEGORIES.find(c => c.id === t.category) || { name: t.category };
      return [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        categoryObj.name,
        t.type,
        t.amount
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions_export.csv';
    link.click();
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* 1. Header Filters */}
      <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="w-full lg:flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by description or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs md:text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500 transition-all dark:text-white shadow-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Desktop/Mobile Row for Filters */}
              <div className="grid grid-cols-2 sm:flex items-center gap-3 sm:gap-4">
                <CustomDropdown
                  options={[{ id: 'all', name: 'Categories' }, ...CATEGORIES]}
                  value={filterCategory}
                  onChange={setFilterCategory}
                  className="w-full sm:w-48"
                />

                <CustomDropdown
                  options={[
                    { id: 'all', name: 'Status' },
                    { id: 'income', name: 'Income' },
                    { id: 'expense', name: 'Expense' }
                  ]}
                  value={filterType}
                  onChange={setFilterType}
                  className="w-full sm:w-40"
                />
              </div>

            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className={clsx(
                  "flex w-full items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-xl transition-all shadow-sm whitespace-nowrap",
                  showExportMenu
                    ? "text-primary-600 dark:text-primary-400 ring-4 ring-primary-500/15 border-primary-500 shadow-lg scale-[1.01]"
                    : "text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                )}
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                <span className="font-black uppercase text-[10px] md:text-[11px] tracking-widest">Export Data</span>
                <ChevronDown className={clsx("w-4 h-4 transition-transform flex-shrink-0", showExportMenu && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 rounded-2xl shadow-floating glass-stroke z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => { exportToJSON(); setShowExportMenu(false); }}
                        className="w-full flex items-center gap-3.5 px-5 py-4 text-left group transition-all hover:bg-gray-50/50 dark:hover:bg-white/5"
                      >
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm ring-2 ring-white/50 dark:ring-slate-800/50 group-hover:scale-125 transition-transform duration-300" />
                        <span className="font-black uppercase text-[10px] md:text-[11px] tracking-widest text-gray-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-300">
                          JSON Format
                        </span>
                      </button>
                      <div className="h-px bg-gray-100 dark:bg-white/5 mx-5" />
                      <button
                        onClick={() => { exportToCSV(); setShowExportMenu(false); }}
                        className="w-full flex items-center gap-3.5 px-5 py-4 text-left group transition-all hover:bg-gray-50/50 dark:hover:bg-white/5"
                      >
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm ring-2 ring-white/50 dark:ring-slate-800/50 group-hover:scale-125 transition-transform duration-300" />
                        <span className="font-black uppercase text-[10px] md:text-[11px] tracking-widest text-gray-600 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-300">
                          CSV Format
                        </span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 2. Filtered Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            label="Filtered Income"
            amount={filteredSummary.income}
            icon={ArrowUpCircle}
            colorClass="bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
          />
          <SummaryCard
            label="Filtered Expense"
            amount={filteredSummary.expenses}
            icon={ArrowDownCircle}
            colorClass="bg-rose-100/50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
          />
          <SummaryCard
            label="Net Result"
            amount={filteredSummary.balance}
            icon={Wallet}
            colorClass="bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
          />
        </div>
      </div>

      {/* 3. Transaction Data Display (Responsive) */}
      <div className="flex-1 transition-all">
        {/* Desktop Table View */}
        <div className="hidden lg:flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-premium h-full">
          <div className="overflow-x-auto overflow-y-auto no-scrollbar scroll-smooth">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/50 transition-colors">
                  <th className="px-6 py-4 text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] cursor-pointer select-none" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-2 hover:text-primary-500 transition-colors font-semibold">Date <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] font-semibold">Description</th>
                  <th className="px-6 py-4 text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] font-semibold">Category</th>
                  <th className="px-6 py-4 text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] font-semibold">Type</th>
                  <th className="px-6 py-4 text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] cursor-pointer select-none" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-2 hover:text-primary-500 transition-colors font-semibold">Amount <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  {role === 'admin' && (
                    <th className="px-6 py-4 text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right font-semibold">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                <AnimatePresence initial={false}>
                  {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((t) => {
                      const categoryObj = CATEGORIES.find(c => c.id === t.category) || CATEGORIES[1];
                      const isIncome = t.type === 'income';
                      return (
                        <motion.tr
                          key={t.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-5 text-xs font-bold text-gray-500 dark:text-slate-400 whitespace-nowrap uppercase tracking-tighter">
                            {t.date}
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-slate-700 dark:text-white leading-tight">{t.description}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-slate-800">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryObj.color }} />
                              <span className="dark:text-slate-300">{categoryObj.name}</span>
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={clsx(
                              "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                              isIncome
                                ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/20"
                                : "bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/20"
                            )}>
                              {t.type}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className={clsx(
                              "text-sm premium-number",
                              isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                            )}>
                              {isIncome ? '+' : '-'}{formatAmount(Math.abs(t.amount))}
                            </div>
                          </td>
                          {role === 'admin' && (
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => onEdit(t)}
                                  className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(t.id)}
                                  className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      );
                    })
                  ) : (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan={role === 'admin' ? 6 : 5} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/10 rounded-full flex items-center justify-center text-primary-500">
                            <XCircle className="w-10 h-10" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black dark:text-white uppercase tracking-tight mb-1">No results found</h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-bold">
                              Try adjusting your search query, selecting a different category, or resetting the date range.
                            </p>
                          </div>
                          <button
                            onClick={handleClearFilters}
                            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-600/20 hover:bg-primary-700 active:scale-95 transition-all"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4 pb-10">
          <AnimatePresence initial={false}>
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((t) => {
                const categoryObj = CATEGORIES.find(c => c.id === t.category) || CATEGORIES[1];
                const isIncome = t.type === 'income';
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-premium space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryObj.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 dark:text-white leading-tight mb-1">{t.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">{t.date}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-700" />
                            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{categoryObj.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className={clsx(
                        "text-base premium-number",
                        isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      )}>
                        {isIncome ? '+' : '-'}{formatAmount(t.amount)}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                      <span className={clsx(
                        "text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border",
                        isIncome
                          ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/20"
                          : "bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/20"
                      )}>
                        {t.type}
                      </span>
                      {role === 'admin' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEdit(t)}
                            className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400 hover:text-primary-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 p-10 text-center shadow-premium">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Recent Transactions</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
