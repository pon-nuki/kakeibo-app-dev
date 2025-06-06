// src/renderer/components/FixedCostList/FixedCostList.tsx
import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../ExpenseList/ExpenseList.css';
import Pagination from '../Pagination/PaginationControls';
import { FixedCostListProps } from '../../../types/fixedCostListTypes';
import { FixedCost } from '../../../types/common';

const ITEMS_PER_PAGE = 10;

// 支払方法のラベルを取得
const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'bank': return '口座振替';
    case 'credit': return 'クレジットカード';
    case 'cash': return '現金';
    case 'other': return 'その他';
    default: return '不明';
  }
};

// カテゴリ名を取得
const getCategoryName = (cost: FixedCost, categories: { id: number, name: string }[]): string => {
  if (cost.categoryId) {
    const category = categories.find((cat) => cat.id === cost.categoryId);
    return category ? category.name : '未設定';
  }
  return '未設定';
};

const FixedCostList: React.FC<FixedCostListProps> = ({
  filteredFixedCosts,
  startEditing,
  handleDeleteFixedCost,
  editId,
  categories,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.ceil(filteredFixedCosts.length / ITEMS_PER_PAGE);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedFixedCosts = filteredFixedCosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
      <List>
        {selectedFixedCosts.map((cost) => (
          <ListItem
            key={cost.id}
            className={editId === cost.id ? 'editing-item' : ''}
          >
            <ListItemText
              primary={cost.description}
              secondary={`¥${cost.amount.toLocaleString()} / ${cost.date} / カテゴリ: ${getCategoryName(cost, categories)} / 支払方法: ${getPaymentMethodLabel(cost.paymentMethod)}`}
            />
            <IconButton onClick={() => startEditing(cost)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteFixedCost(cost.id)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default FixedCostList;
