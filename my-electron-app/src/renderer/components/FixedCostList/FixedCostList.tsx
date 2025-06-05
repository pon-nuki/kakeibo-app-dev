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

const ITEMS_PER_PAGE = 10;

const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'bank': return '口座振替';
    case 'credit': return 'クレジットカード';
    case 'cash': return '現金';
    case 'other': return 'その他';
    default: return '不明';
  }
};

const FixedCostList: React.FC<FixedCostListProps> = ({
  filteredFixedCosts,
  startEditing,
  handleDeleteFixedCost,
  editId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.ceil(filteredFixedCosts.length / ITEMS_PER_PAGE);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedFixedCosts = filteredFixedCosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  console.log('[FixedCostList] props.filteredFixedCosts:', filteredFixedCosts);

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
              secondary={`¥${cost.amount.toLocaleString()} / ${cost.date} / ${getPaymentMethodLabel(cost.paymentMethod)}`}
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

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default FixedCostList;
