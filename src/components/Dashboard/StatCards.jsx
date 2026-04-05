import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useFinance } from '../../context/FinanceContext';

const StatCard = ({ title, amount, type, trend }) => {
  const { formatAmount } = useFinance();
  const isBalance = type === 'balance';
  const isIncome = type === 'income';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 relative overflow-hidden group"
    >
      <div className="flex items-start justify-between">
        <div className="z-10">
          <p className="stat-card-label uppercase text-[10px] tracking-widest font-bold opacity-70 mb-2 font-poppins">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="card-amount text-slate-900 dark:text-white">
              {type === 'expenses' && '-'}{formatAmount(amount)}
            </h3>
            <span className={clsx(
              "flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full select-none",
              isIncome 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            )}>
              {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}%
            </span>
          </div>
        </div>
        <div className={clsx(
          "w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-transform group-hover:scale-110 duration-300",
          isBalance && "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400",
          isIncome && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
          type === 'expenses' && "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
        )}>
          {isBalance && <Wallet className="w-6 h-6" />}
          {isIncome && <TrendingUp className="w-6 h-6" />}
          {type === 'expenses' && <TrendingDown className="w-6 h-6" />}
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className={clsx(
        "absolute -bottom-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500",
        isBalance && "bg-primary-600",
        isIncome && "bg-emerald-600",
        type === 'expenses' && "bg-rose-600"
      )} />
    </motion.div>
  );
};

const StatCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="Total Balance" amount={summary.balance} type="balance" trend={12.5} />
      <StatCard title="Total Income" amount={summary.income} type="income" trend={8.2} />
      <StatCard title="Total Expenses" amount={summary.expenses} type="expenses" trend={4.1} />
    </div>
  );
};

export default StatCards;
