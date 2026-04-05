import React from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Calendar, 
  Zap, 
  ShoppingBag,
  DollarSign,
  PieChart
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIES } from '../../utils/mockData';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { subDays, isWithinInterval } from 'date-fns';
import { jsPDF } from 'jspdf';

const InsightCard = ({ icon: Icon, title, description, type, footer }) => {
  const isPositive = type === 'positive';
  const isWarning = type === 'warning';
  
  return (
    <motion.div 
      className={clsx(
        "group p-5 rounded-2xl border transition-all duration-300 h-full flex flex-col gap-4 relative overflow-hidden shadow-sm",
        isPositive && "bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800",
        isWarning && "bg-white dark:bg-slate-900 border-rose-100 dark:border-rose-900/30 hover:border-rose-200 dark:hover:border-rose-800",
        !type && "bg-white dark:bg-slate-900 border-primary-100 dark:border-primary-900/30 hover:border-primary-200 dark:hover:border-primary-800"
      )}
    >
      {/* Decorative accent background */}
      <div className={clsx(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20",
        isPositive && "bg-emerald-500",
        isWarning && "bg-rose-500",
        !type && "bg-primary-500"
      )} />

      <div className="flex items-center gap-3 relative z-10">
        <div className={clsx(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500",
          isPositive && "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50",
          isWarning && "bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800/50",
          !type && "bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800/50"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
          {title}
        </h4>
      </div>
      
      <div className="flex-1 relative z-10">
        <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 leading-snug">
          {description}
        </p>
      </div>

      {footer && (
        <div className="mt-auto pt-4 border-t border-gray-50 dark:border-white/5 relative z-10">
          <p className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors">
            {footer}
          </p>
        </div>
      )}
    </motion.div>
  );
};

const InsightsPanel = () => {
  const { transactions, formatAmount } = useFinance();
  const now = new Date();
  
  // Date Ranges
  const currentMonth = { start: subDays(now, 29), end: now };
  const lastMonth = { start: subDays(now, 59), end: subDays(now, 30) };

  const getPeriodStats = (interval) => {
    const periodTransactions = transactions.filter(t => 
      isWithinInterval(new Date(t.date), interval)
    );
    
    const income = periodTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = periodTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    // Category totals for expenses
    const catTotals = {};
    const catCounts = {};
    periodTransactions.filter(t => t.type === 'expense').forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });

    return { income, expenses, catTotals, catCounts, count: periodTransactions.length };
  };

  const current = getPeriodStats(currentMonth);
  const previous = getPeriodStats(lastMonth);

  // 1. Highest Spending
  const topCatId = Object.keys(current.catTotals).sort((a, b) => current.catTotals[b] - current.catTotals[a])[0];
  const topCategory = CATEGORIES.find(c => c.id === topCatId) || CATEGORIES[1];
  const topAmount = current.catTotals[topCatId] || 0;

  // 2. Savings Rate
  const savings = current.income - current.expenses;
  const savingsRate = current.income > 0 ? (savings / current.income * 100).toFixed(0) : 0;

  // 3. Monthly Comparison
  const expenseDiff = current.expenses - previous.expenses;
  const expenseChangePercent = previous.expenses > 0 ? ((expenseDiff / previous.expenses) * 100).toFixed(0) : 0;
  const isExpenseUp = expenseDiff > 0;

  // 4. Most Frequent Category
  const freqCatId = Object.keys(current.catCounts).sort((a, b) => current.catCounts[b] - current.catCounts[a])[0];
  const freqCategory = CATEGORIES.find(c => c.id === freqCatId) || CATEGORIES[1];
  const freqCount = current.catCounts[freqCatId] || 0;

  // 5. Average Daily Spending
  const avgDaily = (current.expenses / 30).toFixed(0);

  // 6. Total Savings
  const totalSavings = savings > 0 ? savings : 0;

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(124, 58, 237); // primary-600
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("PERSONAL FINANCE REPORT", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);
    
    // Content Start
    let y = 55;
    
    const addSection = (title, items) => {
      doc.setTextColor(124, 58, 237);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, 20, y);
      y += 8;
      
      doc.setDrawColor(243, 244, 246);
      doc.line(20, y - 2, pageWidth - 20, y - 2);
      
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      items.forEach(item => {
        doc.text(`• ${item.label}:`, 25, y + 2);
        doc.setFont("helvetica", "bold");
        doc.text(`${item.value}`, 75, y + 2);
        doc.setFont("helvetica", "normal");
        y += 8;
      });
      
      y += 10;
    };
    
    addSection("1. SUMMARY STATS", [
      { label: "Total Income", value: formatAmount(current.income) },
      { label: "Total Expenses", value: formatAmount(current.expenses) },
      { label: "Total Savings", value: formatAmount(totalSavings) },
      { label: "Savings Rate", value: `${savingsRate}%` }
    ]);
    
    addSection("2. KEY INSIGHTS", [
      { label: "Highest Spending", value: `${topCategory.name} (-${formatAmount(topAmount)})` },
      { label: "Most Frequent", value: `${freqCategory.name} (${freqCount} txs)` },
      { label: "Avg Daily Spend", value: `-${formatAmount(avgDaily)}` }
    ]);
    
    addSection("3. COMPARISON & ADVICE", [
      { label: "Monthly Change", value: `${isExpenseUp ? 'Increased' : 'Decreased'} by ${Math.abs(expenseChangePercent)}%` },
      { label: "Recommendation", value: "Spread out major purchases for better cash flow." }
    ]);
    
    // Footer
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 275, pageWidth - 20, 275);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text("Generated by Finance Dashboard Pro", pageWidth / 2, 282, { align: "center" });
    
    const reportTitle = `Financial_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(reportTitle);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-black dark:text-white flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-amber-500" />
          Smart Insights
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">Personalized financial feedback based on your recent activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1 — Highest Spending */}
        <InsightCard 
          icon={Zap}
          type="warning"
          title="Highest Spending"
          description={
            <>You've spent <span className="text-rose-600 dark:text-rose-400 font-bold">-{formatAmount(topAmount)}</span> on <span className="font-bold">{topCategory.name}</span> this month. This is your highest spending category.</>
          }
          footer="Budget Alert"
        />

        {/* Card 2 — Savings Rate */}
        <InsightCard 
          icon={CheckCircle2}
          type="positive"
          title="Savings Rate"
          description={
            <>Your savings rate is <span className="text-emerald-600 dark:text-emerald-400 font-bold">{savingsRate}%</span>. Keeping it above 20% is considered financially healthy.</>
          }
          footer="Financial Health"
        />

        {/* Card 3 — Monthly Comparison */}
        <InsightCard 
          icon={isExpenseUp ? TrendingUp : TrendingDown}
          type={isExpenseUp ? "warning" : "positive"}
          title="Monthly Comparison"
          description={
            <>Your expenses <span className="font-bold">{isExpenseUp ? 'increased' : 'decreased'}</span> by <span className={clsx("font-bold", isExpenseUp ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400")}>{Math.abs(expenseChangePercent)}%</span> compared to last month.</>
          }
          footer="Spending Trend"
        />

        {/* Card 4 — Most Frequent Category */}
        <InsightCard 
          icon={ShoppingBag}
          title="Most Frequent Category"
          description={
            <>You made the most transactions in <span className="text-primary-600 dark:text-primary-300 font-bold">{freqCategory.name}</span> category (<span className="font-bold">{freqCount} transactions</span>).</>
          }
          footer="Activity Pattern"
        />

        {/* Card 5 — Average Daily Spending */}
        <InsightCard 
          icon={Calendar}
          title="Average Daily Spending"
          description={
            <>Your average daily spending is <span className="text-primary-600 dark:text-primary-300 font-bold">-{formatAmount(avgDaily)}</span>.</>
          }
          footer="Daily Budget"
        />

        {/* Card 6 — Total Savings */}
        <InsightCard 
          icon={DollarSign}
          type="positive"
          title="Total Savings"
          description={
            <>You saved <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatAmount(totalSavings)}</span> this month. Great job!</>
          }
          footer="Overall Progress"
        />
      </div>

      <div className="relative group overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-white to-primary-50/30 dark:from-slate-900 dark:to-primary-900/10 border border-primary-100/50 dark:border-primary-900/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/5">
        {/* Animated Background Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-600/20 relative transition-transform duration-500">
              <PieChart className="w-8 h-8" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black dark:text-white mb-2 tracking-tight">Weekly Financial Summary</h4>
            <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Your spending is concentrated in the first week of the month. Consider spreading out major purchases for better cash flow.
            </p>
          </div>
          <button 
            onClick={handleDownload}
            className="px-8 py-3.5 bg-primary-600 text-white hover:bg-primary-700 dark:bg-slate-800 dark:hover:bg-slate-700 border border-transparent dark:border-white/10 rounded-2xl text-sm font-black shadow-lg shadow-primary-600/25 dark:shadow-none active:scale-95 transition-all"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
