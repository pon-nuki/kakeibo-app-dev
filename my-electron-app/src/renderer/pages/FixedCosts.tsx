import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import Filter from '../components/ExpenseFilter/ExpenseFilter';
import Pagination from '../components/Pagination/PaginationControls';
import FixedCostForm from '../components/FixedCostForm/FixedCostForm';
import FixedCostList from '../components/FixedCostList/FixedCostList';
import { FixedCost } from '../../types/common.d';
import { fetchCategories } from '../services/categoriesService';
import {
  fetchFixedCosts,
  addFixedCost,
  updateFixedCost,
  deleteFixedCost,
} from '../services/fixedCostService';

const FixedCosts: React.FC = () => {
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [nextPaymentDate, setNextPaymentDate] = useState<Date | null>(null); // 次回支払日
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'annually' | 'other'>('monthly'); // 支払頻度
  const [editId, setEditId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // フィルター
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
  const [searchType, setSearchType] = useState<'exact' | 'range'>('exact');

  // ページング
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAndSetCategories = async () => {
    try {
      const categories = await fetchCategories();
      setCategories(categories);
    } catch (error) {
      setErrorMessage('カテゴリの取得に失敗しました');
    }
  };

  useEffect(() => {
    fetchAndSetCategories();
  }, []);

  const fetchAndSetFixedCosts = async () => {
    try {
      const data = await fetchFixedCosts();
      const normalized = normalizeFixedCosts(data);
      setFixedCosts(normalized);
    } catch {
      setErrorMessage('固定費の取得に失敗しました。');
    }
  };

  useEffect(() => {
    fetchAndSetFixedCosts();
  }, []);

  const handleAdd = async () => {
    if (name && amount && date && paymentMethod && selectedCategory && nextPaymentDate && frequency) {
      try {
        await addFixedCost(name, parseFloat(amount), date.toISOString().slice(0, 10), nextPaymentDate?.toISOString().slice(0, 10), paymentMethod, selectedCategory, frequency);
        await fetchAndSetFixedCosts();
        resetForm();
      } catch {
        setErrorMessage('追加に失敗しました。');
      }
    } else {
      setErrorMessage('すべての項目を入力してください。');
    }
  };

  const handleUpdate = async () => {
    if (editId !== null && name && amount && date && paymentMethod && selectedCategory && nextPaymentDate && frequency) {
      try {
        await updateFixedCost(editId, name, parseFloat(amount), date.toISOString().slice(0, 10), nextPaymentDate?.toISOString().slice(0, 10), paymentMethod, selectedCategory, frequency);
        await fetchAndSetFixedCosts();
        resetForm();
      } catch {
        setErrorMessage('更新に失敗しました。');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFixedCost(id);
      await fetchAndSetFixedCosts();
    } catch {
      setErrorMessage('削除に失敗しました。');
    }
  };

  const startEditing = (cost: FixedCost) => {
    setEditId(cost.id);
    setName(cost.description);
    setAmount(cost.amount.toString());
    setDate(new Date(cost.date));
    setNextPaymentDate(new Date(cost.nextPaymentDate)); // 次回支払日を設定
    setPaymentMethod(cost.paymentMethod);
    setFrequency(cost.frequency); // 支払頻度を設定
    setSelectedCategory(cost.categoryId);
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setAmount('');
    setDate(null);
    setNextPaymentDate(null); // 次回支払日リセット
    setPaymentMethod('bank');
    setFrequency('monthly'); // 支払頻度リセット
    setSelectedCategory(null);
    setErrorMessage(null);
  };

  const filteredCosts = fixedCosts.filter(cost => {
    const costDate = new Date(cost.date);

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

  const normalizeFixedCosts = (rows: any[]): FixedCost[] =>
    rows.map(row => ({
      id: row.id,
      description: row.description,
      amount: row.amount,
      date: row.date,
      nextPaymentDate: row.next_payment_date, // 次回支払日
      paymentMethod: row.payment_method,
      frequency: row.frequency, // 支払頻度
      categoryId: row.category_id,
      category: { id: row.category_id, name: row.category_name },
    }));

  const totalAmount = filteredCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const totalPages = Math.ceil(filteredCosts.length / itemsPerPage);
  const currentItems = filteredCosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="home-container">
      <Box className="header-wrapper">
        <Box className="title-icon-row">
          <Typography variant="h5" className="header-title">固定費管理</Typography>
          <IconButton><FilterListIcon /></IconButton>
        </Box>
      </Box>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <FixedCostForm
        description={name}
        amount={amount}
        startDate={date}
        nextPaymentDate={nextPaymentDate} // 次回支払日
        paymentMethod={paymentMethod}
        frequency={frequency} // 支払頻度
        selectedCategory={selectedCategory}
        categories={categories}
        onDescriptionChange={setName}
        onAmountChange={setAmount}
        onStartDateChange={setDate}
        onNextPaymentDateChange={setNextPaymentDate} // 次回支払日変更用
        onPaymentMethodChange={setPaymentMethod}
        onFrequencyChange={setFrequency} // 支払頻度変更用
        onCategoryChange={setSelectedCategory}
        onSubmit={editId === null ? handleAdd : handleUpdate}
        onCancel={resetForm}
        editId={editId}
      />

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

      <FixedCostList
        filteredFixedCosts={currentItems}
        startEditing={startEditing}
        handleDeleteFixedCost={handleDelete}
        editId={editId}
        categories={categories}
      />

      <Pagination
        currentPage={currentPage}
        pageCount={totalPages}
        onPageChange={(_, page) => setCurrentPage(page)}
      />

      <h3>合計: ¥{totalAmount.toLocaleString()}</h3>
    </div>
  );
};

export default FixedCosts;
