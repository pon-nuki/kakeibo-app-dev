import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Expense {
  id: number;
  description: string;
  amount: number;
}

const Home: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  // データ取得関数
  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3000/expenses');
      const data = await response.json();
      console.log('Fetched expenses:', data);
      // 取得したデータをstateに設定
      setExpenses(data);
    } catch (error) {
      console.error('データ取得に失敗しました:', error);
    }
  };

  // 初回レンダリング時のデータ取得
  useEffect(() => {
    fetchExpenses();
  }, []);

  // 費用追加処理
  const handleAddExpense = async () => {
    if (description && amount) {
      try {
        // Electron経由でDBに追加
        await window.electron.addExpense(description, parseFloat(amount));

        // データ再取得
        await fetchExpenses();

        // 入力クリア
        setDescription('');
        setAmount('');
      } catch (err) {
        console.error('追加に失敗しました:', err);
      }
    }
  };

  // 削除処理
  const handleDeleteExpense = async (id: number) => {
    try {
      const resultMessage = await window.electron.deleteMessage(id);
      console.log('削除結果:', resultMessage.message);

      if (resultMessage.message.includes('削除されました')) {
        console.log('削除後にデータ再取得');
        await fetchExpenses();
      } else {
        alert(resultMessage.message);
      }
    } catch (error) {
      console.error('削除に失敗しました:', error);
    }
  };

  // 合計金額計算
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
      <Button onClick={handleAddExpense} variant="contained">追加</Button>
      <List>
        {expenses.map((expense) => (
          <ListItem key={expense.id}>
            <ListItemText
              primary={expense.description}
              secondary={`¥${expense.amount.toLocaleString()}`}
            />
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
