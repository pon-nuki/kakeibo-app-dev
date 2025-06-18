import React, { useState } from 'react';
import { List } from '@mui/material';
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

  const pageCount = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getCategoryName = (expense: Expense): string => {
    if (expense.categoryId) {
      const category = categories.find((cat) => cat.id === expense.categoryId);
      return category ? category.name : '未設定';
    }
    return '未設定';
  };

  return (
    <div>
      <List className="expense-list">
        <div className="expense-list-header">
          <div className="col col-description">内容</div>
          <div className="col col-amount">金額</div>
          <div className="col col-date">日付</div>
          <div className="col col-category">カテゴリ</div>
          <div className="col col-actions">操作</div>
        </div>

        {selectedExpenses.map((expense) => (
          <div
            key={expense.id}
            className={`expense-list-item ${editId === expense.id ? 'editing-item' : ''}`}
          >
            <div className="col col-description">{expense.description}</div>
            <div className="col col-amount">¥{expense.amount.toLocaleString()}</div>
            <div className="col col-date">{expense.date}</div>
            <div className="col col-category">{getCategoryName(expense)}</div>
            <div className="col col-actions">
              <button className="icon-button edit" title="編集" onClick={() => startEditing(expense)}>
                <EditIcon />
              </button>
              <button className="icon-button delete" title="削除" onClick={() => handleDeleteExpense(expense.id)}>
                <DeleteIcon />
              </button>
            </div>
          </div>
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

export default ExpenseList;
