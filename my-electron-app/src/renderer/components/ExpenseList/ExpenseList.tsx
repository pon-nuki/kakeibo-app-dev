import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './ExpenseList.css';
import Pagination from '../Pagination/PaginationControls';
import { ExpenseListProps } from '../../../types/expenseListTypes';
import { Expense } from '../../../types/common';

const ITEMS_PER_PAGE = 10;

const ExpenseList: React.FC<ExpenseListProps> = ({
  filteredExpenses,
  startEditing,
  handleDeleteExpense,
  editId,
  categories,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // ページ数計算
  const pageCount = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);

  // ページ変更ハンドラ
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // ページネーション用のデータ選択
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // categoryオブジェクトからカテゴリ名を取得
  const getCategoryName = (expense: Expense): string => {
    if (expense.categoryId) {
      const category = categories.find((cat) => cat.id === expense.categoryId);
      return category ? category.name : '未設定';
    }
    return '未設定';
  };

  return (
    <div>
      <List>
        {selectedExpenses.map((expense) => (
          <ListItem
            key={expense.id}
            className={editId === expense.id ? 'editing-item' : ''}
          >
            <ListItemText
              primary={expense.description}
              secondary={`¥${expense.amount.toLocaleString()} / ${expense.date} / カテゴリ: ${getCategoryName(expense)}`}
            />
            <IconButton onClick={() => startEditing(expense)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteExpense(expense.id)} color="secondary">
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

export default ExpenseList;
