import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Expense {
  id: number;
  description: string;
  amount: number;
}

const Home: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState<number | null>(null); // 編集対象ID

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3000/expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('データ取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    if (description && amount) {
      try {
        await window.electron.addExpense(description, parseFloat(amount));
        await fetchExpenses();
        setDescription('');
        setAmount('');
      } catch (err) {
        console.error('追加に失敗しました:', err);
      }
    }
  };

  const handleUpdateExpense = async () => {
    if (editId !== null && description && amount) {
      try {
        await window.electron.updateExpense(editId, description, parseFloat(amount));
        await fetchExpenses();
        setEditId(null);
        setDescription('');
        setAmount('');
      } catch (err) {
        console.error('更新に失敗しました:', err);
      }
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      const resultMessage = await window.electron.deleteMessage(id);
      if (resultMessage.message.includes('削除されました')) {
        await fetchExpenses();
      } else {
        alert(resultMessage.message);
      }
    } catch (error) {
      console.error('削除に失敗しました:', error);
    }
  };

  const startEditing = (expense: Expense) => {
    setEditId(expense.id);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
  };

  const cancelEdit = () => {
    setEditId(null);
    setDescription('');
    setAmount('');
  };

  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div>
      <h2>家計簿</h2>
      <TextField
        label="内容"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        label="金額"
        variant="outlined"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {editId === null ? (
        <Button onClick={handleAddExpense} variant="contained">追加</Button>
      ) : (
        <>
          <Button onClick={handleUpdateExpense} variant="contained" color="primary">更新</Button>
          <Button onClick={cancelEdit} variant="outlined" color="secondary">キャンセル</Button>
        </>
      )}

      <List>
        {expenses.map((expense) => (
          <ListItem key={expense.id}>
            <ListItemText
              primary={expense.description}
              secondary={`¥${expense.amount.toLocaleString()}`}
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
      <h3>合計: ¥{totalAmount.toLocaleString()}</h3>
    </div>
  );
};

export default Home;
