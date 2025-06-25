import React, { useState, useEffect } from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import './Home.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import Filter from '../components/ExpenseFilter/ExpenseFilter';
import ExpenseList from '../components/ExpenseList/ExpenseList';
import ExpenseForm from '../components/ExpenseForm/ExpenseForm';
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from '../services/expenseService';
import { Expense, FixedCost } from '../../types/common';
import { fetchCategories } from '../services/categoriesService';
import { normalizeFixedCosts } from '../../utils/normalizers';
import { fetchFixedCosts } from '../services/fixedCostService';
import FixedCostSummary from '../components/FixedCostSummary/FixedCostSummary';
import { useTranslation } from 'react-i18next';
import CurrencyAmount from '../components/CurrencyAmount/CurrencyAmount';
import{ ShoppingHistoryItem } from '../../types/shoppingHistoryItem';

const Home: React.FC = () => {
  const allowedCurrencies = ['JPY', 'USD', 'RUB'] as const;
  type CurrencyCode = typeof allowedCurrencies[number];
  const [currency, setCurrency] = useState<CurrencyCode>('JPY');
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
  const [searchType, setSearchType] = useState<'exact' | 'range'>('exact');

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingHistoryItem[]>([]);

  useEffect(() => {
    const loadShoppingHistory = async () => {
      try {
        const data = await window.electron.getShoppingHistory();
        if (data) {
          setShoppingHistory(data);
        }
      } catch (err) {
        console.error('支出傾向履歴の読み込みに失敗:', err);
      }
    };

    loadShoppingHistory();
  }, []);

  const fetchAndSetFixedCosts = async () => {
    try {
      const data = await fetchFixedCosts();
      const normalized = normalizeFixedCosts(data);
      setFixedCosts(normalized);
    } catch {
      setErrorMessage(t('home.errorFetchFixedCosts'));
    }
  };

  const fetchAndSetCategories = async () => {
    try {
      const categories = await fetchCategories();
      setCategories(categories);
    } catch {
      setErrorMessage(t('home.errorFetchCategories'));
    }
  };

  const fetchAndSetExpenses = async () => {
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch {
      setErrorMessage(t('home.errorFetchExpenses'));
    }
  };

  useEffect(() => {
    fetchAndSetFixedCosts();
    fetchAndSetCategories();
    fetchAndSetExpenses();
  }, []);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const result = await window.electron.getSetting('currency');
        const value = result.value;
        if (allowedCurrencies.includes(value as CurrencyCode)) {
          setCurrency(value as CurrencyCode);
        } else {
          setCurrency('JPY');
        }
      } catch (err) {
        console.error('通貨設定取得エラー:', err);
        setCurrency('JPY');
      }
    };

    fetchCurrency();
  }, []);

  const handleAddExpense = async () => {
    if (description && amount && startDate && selectedCategory !== null) {
      try {
        await addExpense(description, parseFloat(amount), startDate.toISOString().slice(0, 10), selectedCategory);
        await fetchAndSetExpenses();
        setDescription('');
        setAmount('');
        setStartDate(null);
        setSelectedCategory(null);
        setErrorMessage('');
      } catch {
        setErrorMessage(t('home.errorAdd'));
      }
    } else {
      setErrorMessage(t('home.errorMissingFields'));
    }
  };

  const handleUpdateExpense = async () => {
    if (editId !== null && description && amount && startDate && selectedCategory !== null) {
      try {
        await updateExpense(editId, description, parseFloat(amount), startDate.toISOString().slice(0, 10), selectedCategory);
        await fetchAndSetExpenses();
        setEditId(null);
        setDescription('');
        setAmount('');
        setStartDate(null);
        setSelectedCategory(null);
        setErrorMessage('');
      } catch {
        setErrorMessage(t('home.errorUpdate'));
      }
    } else {
      setErrorMessage(t('home.errorNoEditTarget'));
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      const success = await deleteExpense(id);
      if (success) {
        await fetchAndSetExpenses();
      }
    } catch {
      setErrorMessage(t('home.errorDelete'));
    }
  };

  const startEditing = (expense: Expense) => {
    setEditId(expense.id);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setStartDate(new Date(expense.date));
    setSelectedCategory(expense.categoryId);
  };

  const cancelEdit = () => {
    setEditId(null);
    setDescription('');
    setAmount('');
    setStartDate(null);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    if (searchType === 'exact' && filterDate) {
      return expenseDate.toDateString() === filterDate.toDateString();
    }
    if (searchType === 'range') {
      if (rangeStartDate && rangeEndDate) return expenseDate >= rangeStartDate && expenseDate <= rangeEndDate;
      if (rangeStartDate) return expenseDate >= rangeStartDate;
      if (rangeEndDate) return expenseDate <= rangeEndDate;
    }
    return true;
  });

  const filteredFixedCosts = fixedCosts.filter((fc) => {
    const costDate = new Date(fc.date);
    if (searchType === 'exact' && filterDate) {
      return costDate.toDateString() === filterDate.toDateString();
    }
    if (searchType === 'range') {
      if (rangeStartDate && rangeEndDate) return costDate >= rangeStartDate && costDate <= rangeEndDate;
      if (rangeStartDate) return costDate >= rangeStartDate;
      if (rangeEndDate) return costDate <= rangeEndDate;
    }
    return true;
  });

  const totalFilteredAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="home-container">
      <Box className="header-wrapper">
        <Box className="title-icon-row">
          <Typography variant="h5" className="header-title">{t('home.title')}</Typography>
          <IconButton className="filter-icon-button"><FilterListIcon /></IconButton>
        </Box>
      </Box>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <ExpenseForm
        description={description}
        amount={amount}
        startDate={startDate}
        editId={editId}
        selectedCategory={selectedCategory}
        categories={categories}
        onSubmit={editId === null ? handleAddExpense : handleUpdateExpense}
        onCancel={cancelEdit}
        onDescriptionChange={setDescription}
        onAmountChange={setAmount}
        onStartDateChange={setStartDate}
        onCategoryChange={setSelectedCategory}
      />

      <hr />

      <Filter
        searchType={searchType}
        setSearchType={setSearchType}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        rangeStartDate={rangeStartDate}
        setRangeStartDate={setRangeStartDate}
        rangeEndDate={rangeEndDate}
        setRangeEndDate={setRangeEndDate}
      />

      <ExpenseList
        filteredExpenses={filteredExpenses}
        startEditing={startEditing}
        handleDeleteExpense={handleDeleteExpense}
        editId={editId}
        categories={categories}
      />

      <Box sx={{ mt: 4 }}>
        <h3>
          {t('home.totalVariable')}: <CurrencyAmount amount={totalFilteredAmount} currencyCode={currency} />
        </h3>
        <FixedCostSummary
          fixedCosts={filteredFixedCosts}
          categories={categories}
          totalVariable={totalFilteredAmount}
          currency={currency}
        />
      </Box>
      {shoppingHistory.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            支出傾向のある閲覧履歴（最近のもの）
          </Typography>
          <ul style={{ paddingLeft: 16 }}>
            {shoppingHistory.slice(0, 5).map((item, index) => (
              <li key={index} style={{ marginBottom: 8 }}>
                <Typography variant="body2" color="textSecondary">
                  {new Date(item.visited).toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  {item.title}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </div>
  );
};

export default Home;
