import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './ExpenseList.css';

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

interface ExpenseListProps {
  filteredExpenses: Expense[];
  startEditing: (expense: Expense) => void;
  handleDeleteExpense: (id: number) => void;
  editId: number | null;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ filteredExpenses, startEditing, handleDeleteExpense, editId }) => {
  return (
      <List>
        {filteredExpenses.map((expense) => (
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
  );
};

export default ExpenseList;
