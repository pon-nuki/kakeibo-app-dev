import React, { useState, useEffect } from 'react';
import { IconButton, Box, Typography } from '@mui/material';
import './Home.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import Filter from '../components/ExpenseFilter/ExpenseFilter';
import ExpenseList from '../components/ExpenseList/ExpenseList';
import ExpenseForm from '../components/ExpenseForm/ExpenseForm';
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from '../services/expenseService';
import { Expense } from '../../types/common.d';
import { fetchCategories } from '../services/categoriesService';

const Home: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // フィルター用
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
  const [searchType, setSearchType] = useState<'exact' | 'range'>('exact');

  // カテゴリ用
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // カテゴリを取得する
  const fetchAndSetCategories = async () => {
    try {
      // fetchCategories関数を呼び出し、取得したカテゴリデータをsetCategoriesに格納
      const categories = await fetchCategories();
      setCategories(categories);
    } catch (error) {
      setErrorMessage('カテゴリの取得に失敗しました');
    }
  };

  useEffect(() => {
    fetchAndSetCategories();
  }, []);

  // データを取得する
  const fetchAndSetExpenses = async () => {
    try {
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (error) {
      setErrorMessage('データの取得に失敗しました。');
    }
  };

  useEffect(() => {
    fetchAndSetExpenses();
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
      } catch (err) {
        setErrorMessage('追加に失敗しました');
      }
    } else {
      setErrorMessage('内容・金額・日付は必須です。');
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
      } catch (err) {
        setErrorMessage('費用の更新に失敗しました。');
      }
    } else {
      setErrorMessage('編集する費用が選ばれていません。');
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      const success = await deleteExpense(id);
      if (success) {
        await fetchAndSetExpenses();
      }
    } catch (error) {
      setErrorMessage('費用の削除に失敗しました。');
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

  const filteredExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);

      if (searchType === 'exact' && filterDate) {
        const selectedDate = filterDate.toLocaleDateString('ja-JP');
        const expenseDateFormatted = expenseDate.toLocaleDateString('ja-JP');
        return selectedDate === expenseDateFormatted;
      }

      if (searchType === 'range') {
        if (rangeStartDate && rangeEndDate) {
          return expenseDate >= rangeStartDate && expenseDate <= rangeEndDate;
        }
        if (rangeStartDate && !rangeEndDate) {
          return expenseDate >= rangeStartDate;
        }
        if (!rangeStartDate && rangeEndDate) {
          return expenseDate <= rangeEndDate;
        }
      }

      return true;
    });

  const totalFilteredAmount = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="home-container">
      <Box className="header-wrapper">
        <Box className="title-icon-row">
          <Typography variant="h5" className="header-title">家計簿</Typography>
          <IconButton className="filter-icon-button">
            <FilterListIcon />
          </IconButton>
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

      <h3>合計: ¥{totalFilteredAmount.toLocaleString()}</h3>
    </div>
  );
};

export default Home;
