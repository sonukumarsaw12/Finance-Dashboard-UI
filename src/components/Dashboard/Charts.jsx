import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES, calculateTrendData } from '../../utils/mockData';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  const { formatAmount } = useFinance();
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 border border-gray-100 dark:border-white/5 shadow-2xl rounded-2xl min-w-[160px]">
        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">{label}</p>
        <div className="space-y-2">
          {payload.map((item, index) => {
            const isIncome = item.dataKey === 'income';
            return (
              <div key={index} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-tight">{item.name}</span>
                  </div>
                  <span className="text-xs font-black dark:text-white">
                    {item.dataKey === 'expenses' && '-'}{formatAmount(item.value)}
                  </span>
                </div>
                {isIncome && item.payload.incomeSource && (
                  <p className="pl-3.5 text-[9px] font-bold text-emerald-600/70 dark:text-emerald-400/70 italic uppercase tracking-tighter">
                    ({item.payload.incomeSource})
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  const { formatAmount } = useFinance();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 p-4 border border-gray-100 dark:border-white/5 shadow-2xl rounded-2xl min-w-[160px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white">{data.name}</p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Amount:</span>
            <span className="text-xs font-black dark:text-white">-{formatAmount(data.value)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Percentage:</span>
            <span className="text-xs font-black text-primary-600 dark:text-primary-400">{data.percent}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Transactions:</span>
            <span className="text-xs font-black dark:text-white">{data.count}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const Charts = () => {
  const { transactions, theme, formatAmount, getCurrencySymbol } = useFinance();
  const rawTrendData = calculateTrendData(transactions);
  const isDark = theme === 'dark';

  const [timeRange, setTimeRange] = useState('weekly');
  const [visibleLines, setVisibleLines] = useState({
    income: true,
    expenses: true,
    balance: true
  });

  const trendData = timeRange === 'weekly' ? rawTrendData.slice(-7) : rawTrendData;

  // Complex Category Breakdown
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpenseVal = expenseTransactions.reduce((s, t) => s + t.amount, 0);

  const categoryData = CATEGORIES.filter(cat => cat.type === 'expense').map(cat => {
    const periodTransactions = expenseTransactions.filter(t => t.category === cat.id);
    const total = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      name: cat.name,
      value: total,
      color: cat.color,
      count: periodTransactions.length,
      percent: totalExpenseVal > 0 ? ((total / totalExpenseVal) * 100).toFixed(0) : 0
    };
  }).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  const topCategory = categoryData[0];

  const chartColors = {
    income: '#10b981',
    expenses: '#f43f5e',
    balance: '#8b5cf6',
    text: isDark ? '#94A3B8' : '#64748B',
    grid: isDark ? '#ffffff10' : '#E2E8F0',
  };

  const toggleLine = (key) => setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10 mt-4">
      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6 min-h-[440px] flex flex-col"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h3 className="section-title text-slate-900 dark:text-white">Balance Analytics</h3>
            <div className="flex items-center gap-4 mt-2">
              <button onClick={() => toggleLine('income')} className={clsx("flex items-center gap-1.5 transition-opacity", !visibleLines.income && "opacity-30")}>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Income</span>
              </button>
              <button onClick={() => toggleLine('expenses')} className={clsx("flex items-center gap-1.5 transition-opacity", !visibleLines.expenses && "opacity-30")}>
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Expenses</span>
              </button>
              <button onClick={() => toggleLine('balance')} className={clsx("flex items-center gap-1.5 transition-opacity", !visibleLines.balance && "opacity-30")}>
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Balance</span>
              </button>
            </div>
          </div>
          <div className="flex p-1 bg-gray-100 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-white/5">
            <button onClick={() => setTimeRange('weekly')} className={clsx("px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", timeRange === 'weekly' ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300")}>Weekly</button>
            <button onClick={() => setTimeRange('monthly')} className={clsx("px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all", timeRange === 'monthly' ? "bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300")}>Monthly</button>
          </div>
        </div>
        <div className="flex-1 w-full h-[320px] outline-none group">
          <ResponsiveContainer width="100%" height="100%" className="outline-none">
            <AreaChart data={trendData} style={{ outline: 'none' }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.balance} stopOpacity={0.1} /><stop offset="95%" stopColor={chartColors.balance} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: chartColors.text, fontWeight: 700 }} dy={12} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: chartColors.text, fontWeight: 700 }} tickFormatter={(v) => `${getCurrencySymbol()}${v}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: chartColors.grid, strokeWidth: 1 }} />
              {visibleLines.income && <Area type="monotone" name="Income" dataKey="income" stroke={chartColors.income} strokeWidth={3} fill="none" />}
              {visibleLines.expenses && <Area type="monotone" name="Expenses" dataKey="expenses" stroke={chartColors.expenses} strokeWidth={3} fill="none" />}
              {visibleLines.balance && <Area type="monotone" name="Balance" dataKey="balance" stroke={chartColors.balance} strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Spending Profile Overhaul */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6 min-h-[440px] flex flex-col"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="section-title text-slate-900 dark:text-white">Spending Profile</h3>
          <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full border border-primary-100 dark:border-primary-900/30">
            {categoryData.length} active categories
          </span>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Donut Chart with Center Text */}
          <div className="relative h-[220px] w-full outline-none">
            <ResponsiveContainer width="100%" height="100%" className="outline-none">
              <PieChart style={{ outline: 'none' }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-300 outline-none"
                      style={{ opacity: activeIndex === null || activeIndex === index ? 1 : 0.6 }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: activeIndex === null ? 1 : 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2 transition-opacity duration-300"
            >
              <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Total Expense</span>
              <span className="text-lg font-black text-slate-800 dark:text-white leading-none">-{formatAmount(totalExpenseVal)}</span>
              {topCategory && (
                <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-tighter mt-1">
                  {topCategory.percent}% on {topCategory.name.split(' ')[0]}
                </span>
              )}
            </motion.div>
          </div>

          {/* Top Categories List */}
          <div className="space-y-4">
            {categoryData.slice(0, 6).map((cat, idx) => (
              <div
                key={idx}
                className={clsx(
                  "space-y-2 transition-opacity duration-300",
                  activeIndex !== null && activeIndex !== categoryData.indexOf(cat) && "opacity-30"
                )}
              >
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-[10px] font-black dark:text-white uppercase tracking-widest">{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-800 dark:text-white text-right">
                    -{formatAmount(cat.value)} <br />
                    <span className="text-gray-400 font-bold ml-1">({cat.percent}%)</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percent}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color, opacity: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Insight Footer */}
        {topCategory && (
          <div className="mt-8 p-4 bg-primary-50/50 dark:bg-slate-800/50 border border-primary-100 dark:border-white/5 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white mb-1">
                You spend most on {topCategory.name} ({topCategory.percent}%).
              </p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
                Try to keep housing & daily costs under 40% of your total income. Your {topCategory.percent}% spending in this category is currently <span className={clsx(parseInt(topCategory.percent) > 40 ? "text-rose-500" : "text-emerald-500", "font-black")}>{parseInt(topCategory.percent) > 40 ? 'above' : 'below'}</span> average.
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Charts;
