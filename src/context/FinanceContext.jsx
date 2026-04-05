import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { generateMockTransactions } from '../utils/mockData';

const FinanceContext = createContext();

const financeReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    default:
      return state;
  }
};

const CURRENCIES = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar', code: 'USD' },
  INR: { symbol: '₹', rate: 83, name: 'Indian Rupee', code: 'INR' },
  EUR: { symbol: '€', rate: 0.92, name: 'Euro', code: 'EUR' },
};

export const FinanceProvider = ({ children }) => {
  // Persistence Loading
  const savedTransactions = JSON.parse(localStorage.getItem('finance_transactions'));
  const savedRole = localStorage.getItem('finance_role') || 'admin';
  const savedTheme = localStorage.getItem('finance_theme') || 'light';
  const savedCurrency = localStorage.getItem('finance_currency') || 'USD';

  const [state, dispatch] = useReducer(financeReducer, {
    transactions: savedTransactions || generateMockTransactions(),
  });

  const [role, setRole] = useState(savedRole);
  const [theme, setTheme] = useState(savedTheme);
  const [currency, setCurrency] = useState(savedCurrency);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [notification, setNotification] = useState(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finance_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('finance_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Notification Helper
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  // Currency Formatting Helper
  const formatAmount = (value) => {
    const cur = CURRENCIES[currency];
    const converted = value * cur.rate;
    return `${cur.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const getCurrencySymbol = () => CURRENCIES[currency].symbol;

  // Derived State: Advanced Filtering
  const filteredTransactions = state.transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesType = filterType === 'all' || t.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getSummary = (txs) => txs.reduce(
    (acc, t) => {
      const amount = Math.abs(Number(t.amount));
      if (t.type === 'income') acc.income += amount;
      else acc.expenses += amount;
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );

  const summary = getSummary(state.transactions);
  const filteredSummary = getSummary(filteredTransactions);

  return (
    <FinanceContext.Provider
      value={{
        transactions: state.transactions,
        filteredTransactions,
        summary,
        filteredSummary,
        role,
        setRole,
        theme,
        setTheme,
        currency,
        setCurrency,
        CURRENCIES,
        formatAmount,
        getCurrencySymbol,
        searchQuery,
        setSearchQuery,
        filterCategory,
        setFilterCategory,
        filterType,
        setFilterType,
        notification,
        showNotification,
        dispatch,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
