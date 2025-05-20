import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import './Home.css'; // CSS ファイルを読み込み

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

const Home: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3000/expenses');
      if (!response.ok) {
        throw new Error('データ取得に失敗しました');
      }
      const data = await response.json();
      console.log(data);
      setExpenses(data);
    } catch (error) {
      console.error(error);
      alert('データの取得に失敗しました。');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    if (description && amount && startDate) {
      try {
        await window.electron.addExpense(description, parseFloat(amount), startDate ? startDate.toLocaleDateString('ja-JP') : '');
        await fetchExpenses();
        setDescription('');
        setAmount('');
        setStartDate(null);
      } catch (err) {
        console.error('追加に失敗しました:', err);
        alert('費用の追加に失敗しました。');
      }
    } else {
      alert('内容と金額は必須です。');
    }
  };

  const handleUpdateExpense = async () => {
    if (editId !== null && description && amount && startDate) {
      try {
        await window.electron.updateExpense(editId, description, parseFloat(amount), startDate ? startDate.toLocaleDateString('ja-JP') : '');
        await fetchExpenses();
        setEditId(null);
        setDescription('');
        setAmount('');
        setStartDate(null);
      } catch (err) {
        console.error('更新に失敗しました:', err);
        alert('費用の更新に失敗しました。');
      }
    } else {
      alert('編集する費用が選ばれていません。');
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
      alert('費用の削除に失敗しました。');
    }
  };

  const startEditing = (expense: Expense) => {
    setEditId(expense.id);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setStartDate(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setDescription('');
    setAmount('');
    setStartDate(null);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    if (startDate && expenseDate < startDate) return false;
    return true;
  });

  const totalFilteredAmount = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="home-container">
      <h2>家計簿</h2>

      <div className="input-row">
        <TextField
          label="内容"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"  // クラス名を追加
        />
        <TextField
          label="金額"
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field"  // クラス名を追加
        />

        {editId === null ? (
          <Button onClick={handleAddExpense} variant="contained">追加</Button>
        ) : (
          <>
            <Button onClick={handleUpdateExpense} variant="contained" color="primary">更新</Button>
            <Button onClick={cancelEdit} variant="outlined" color="secondary">キャンセル</Button>
          </>
        )}
      </div>

      <div className="date-picker-row">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <DatePicker
            label="日付"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            slots={{ textField: TextField }}
            slotProps={{ textField: { className: 'date-picker-input' } }}
            enableAccessibleFieldDOMStructure={false}
          />
        </LocalizationProvider>
      </div>

      <List>
        {filteredExpenses.map((expense) => (
          <ListItem key={expense.id}>
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

      <h3>合計: ¥{totalFilteredAmount.toLocaleString()}</h3>
    </div>
  );
};

export default Home;
