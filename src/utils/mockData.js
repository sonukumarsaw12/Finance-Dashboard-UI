import { subDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const CATEGORIES = [
  // Income Categories
  { id: 'salary', name: 'Salary', color: '#10b981', icon: 'DollarSign', type: 'income' },
  { id: 'freelance', name: 'Freelance', color: '#3b82f6', icon: 'Briefcase', type: 'income' },
  { id: 'bonus', name: 'Bonus', color: '#f59e0b', icon: 'Trophy', type: 'income' },
  { id: 'investments', name: 'Investments', color: '#8b5cf6', icon: 'LineChart', type: 'income' },
  { id: 'gift', name: 'Gift', color: '#ec4899', icon: 'Gift', type: 'income' },
  { id: 'side_hustle', name: 'Side Hustle', color: '#4f46e5', icon: 'Zap', type: 'income' },
  { id: 'other_income', name: 'Other Income', color: '#64748b', icon: 'Coins', type: 'income' },

  // Expense Categories
  { id: 'food', name: 'Food & Dining', color: '#f59e0b', icon: 'Utensils', type: 'expense' },
  { id: 'rent', name: 'Rent & Housing', color: '#6366f1', icon: 'Home', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', color: '#8b5cf6', icon: 'Film', type: 'expense' },
  { id: 'utilities', name: 'Utilities', color: '#ef4444', icon: 'Zap', type: 'expense' },
  { id: 'shopping', name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag', type: 'expense' },
  { id: 'transport', name: 'Transport', color: '#4f46e5', icon: 'Car', type: 'expense' },
  { id: 'other', name: 'Other', color: '#94a3b8', icon: 'MoreHorizontal', type: 'expense' },
];

export const generateMockTransactions = () => {
  const transactions = [];
  const now = new Date();
  
  // Salaries (Current and Last Month)
  [0, 30].forEach(days => {
    transactions.push({
      id: `salary-${days}`,
      date: format(subDays(startOfMonth(now), days), 'yyyy-MM-dd'),
      amount: 5000,
      category: 'salary',
      type: 'income',
      description: 'Monthly Salary',
    });
  });

  // Rent (Current and Last Month)
  [5, 35].forEach(days => {
    transactions.push({
      id: `rent-${days}`,
      date: format(subDays(now, days), 'yyyy-MM-dd'),
      amount: 1500,
      category: 'rent',
      type: 'expense',
      description: 'Apartment Rent',
    });
  });

  // Random expenses for the last 60 days
  const descriptions = {
    food: ['Grocery Store', 'Dinner with friends', 'Coffee shop', 'Lunch delivery'],
    entertainment: ['Netflix Subscription', 'Movie tickets', 'Gaming store'],
    utilities: ['Electricity Bill', 'Water Bill', 'Internet'],
    shopping: ['Amazon purchase', 'Clothing store', 'Electronics'],
    transport: ['Gas station', 'Uber ride', 'Bus pass'],
    health: ['Pharmacy', 'Gym membership'],
  };

  for (let i = 0; i < 60; i++) {
    const date = subDays(now, i);
    // Don't duplicate rent/salary days
    if (i % 30 === 0 || i === 5 || i === 35) continue;

    const dayTransactionsCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 random transactions per day
    
    for (let j = 0; j < dayTransactionsCount; j++) {
      const categoryObj = CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1];
      const category = categoryObj.id;
      const type = 'expense';
      const possibleDescriptions = descriptions[category] || ['Misc expense'];
      const description = possibleDescriptions[Math.floor(Math.random() * possibleDescriptions.length)];
      const amount = Math.floor(Math.random() * 100) + 10;

      transactions.push({
        id: `t-${i}-${j}`,
        date: format(date, 'yyyy-MM-dd'),
        amount,
        category,
        type,
        description,
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const calculateTrendData = (transactions) => {
  const now = new Date();
  const last30Days = eachDayOfInterval({
    start: subDays(now, 29),
    end: now,
  });

  let balance = 0; // Starting baseline for cumulative tracking
  
  return last30Days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    
    let dayIncome = 0;
    let dayExpenses = 0;
    let incomeSource = null;

    dayTransactions.forEach(t => {
      if (t.type === 'income') {
        dayIncome += t.amount;
        balance += t.amount;
        // Capture the primary income source for the tooltip
        if (!incomeSource || t.amount > 0) incomeSource = t.description;
      } else {
        dayExpenses += t.amount;
        balance -= t.amount;
      }
    });

    return {
      date: format(date, 'MMM dd'),
      income: dayIncome,
      expenses: dayExpenses,
      incomeSource,
      balance,
    };
  });
};
