import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, PaginationItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './ExpenseList.css';
import Pagination from '../Pagination/PaginationControls';
import { Expense } from '../../../types/index';

interface ExpenseListProps {
  filteredExpenses: Expense[];
  startEditing: (expense: Expense) => void;
  handleDeleteExpense: (id: number) => void;
  editId: number | null;
}

const ITEMS_PER_PAGE = 10;

const ExpenseList: React.FC<ExpenseListProps> = ({
  filteredExpenses,
  startEditing,
  handleDeleteExpense,
  editId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
              secondary={`¥${expense.amount.toLocaleString()} / ${expense.date}`}
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
