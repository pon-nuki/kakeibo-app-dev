// FixedCosts.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link } from 'react-router-dom';
import Filter from '../components/ExpenseFilter/ExpenseFilter';
import Pagination from '../components/Pagination/PaginationControls';
import FixedCostForm from '../components/FixedCostForm/FixedCostForm';
import FixedCostList from '../components/FixedCostList/FixedCostList';
import {
  fetchFixedCosts,
  addFixedCost,
  updateFixedCost,
  deleteFixedCost,
} from '../services/fixedCostService';

interface FixedCost {
  id: number;
  description: string;
  amount: number;
  date: string;
}

const FixedCosts: React.FC = () => {
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // フィルター
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
  const [searchType, setSearchType] = useState<'exact' | 'range'>('exact');

  // ページング
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAndSetFixedCosts();
  }, []);

  const fetchAndSetFixedCosts = async () => {
    try {
      const data = await fetchFixedCosts();
      setFixedCosts(data);
    } catch {
      setErrorMessage('固定費の取得に失敗しました。');
    }
  };

  const handleAdd = async () => {
    if (name && amount && date) {
      try {
        console.log('test1')
        await addFixedCost(name, parseFloat(amount), date.toISOString().slice(0, 10));
        console.log('test2')
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
    if (editId !== null && name && amount && date) {
      try {
        await updateFixedCost(editId, name, parseFloat(amount), date.toISOString().slice(0, 10));
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
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setAmount('');
    setDate(null);
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
        <Link to="/budget" className="budget-link">
          <button className="budget-button">予算設定</button>
        </Link>
        <Link to="/" className="budget-link">
          <button className="budget-button">家計簿へ</button>
        </Link>
      </Box>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <FixedCostForm
        description={name}
        amount={amount}
        startDate={date}
        onDescriptionChange={setName}
        onAmountChange={setAmount}
        onStartDateChange={setDate}
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
