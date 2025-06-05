// FixedCosts.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import Filter from '../components/ExpenseFilter/ExpenseFilter';
import Pagination from '../components/Pagination/PaginationControls';
import FixedCostForm from '../components/FixedCostForm/FixedCostForm';
import FixedCostList from '../components/FixedCostList/FixedCostList';
import { FixedCost } from '../../types/common.d';
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
  const [paymentMethod, setPaymentMethod] = useState('bank');
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
      const normalized = normalizeFixedCosts(data);
      setFixedCosts(normalized);
    } catch {
      setErrorMessage('固定費の取得に失敗しました。');
    }
  };

  const handleAdd = async () => {
    if (name && amount && date && paymentMethod) {
      try {
        await addFixedCost(name, parseFloat(amount), date.toISOString().slice(0, 10), paymentMethod);
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
    if (editId !== null && name && amount && date && paymentMethod) {
      try {
        await updateFixedCost(editId, name, parseFloat(amount), date.toISOString().slice(0, 10), paymentMethod);
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
    setPaymentMethod(cost.paymentMethod);
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setAmount('');
    setDate(null);
    setPaymentMethod('');
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
      paymentMethod: row.payment_method,
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
        paymentMethod={paymentMethod}
        onDescriptionChange={setName}
        onAmountChange={setAmount}
        onStartDateChange={setDate}
        onPaymentMethodChange={setPaymentMethod}
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
