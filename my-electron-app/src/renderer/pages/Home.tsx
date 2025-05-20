import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import './Home.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuIcon from '@mui/icons-material/Menu';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // フィルター用
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
  const [searchType, setSearchType] = useState<'exact' | 'range'>('exact'); // 検索タイプ

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3000/expenses');
      if (!response.ok) throw new Error('データ取得に失敗しました');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error(error);
      setErrorMessage('データの取得に失敗しました。');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    // 内容・金額・日付が全て入力されているかを確認
    if (description && amount && startDate) {
      try {
        if (!window.electron || !window.electron.addExpense) {
          setErrorMessage('Electron API が使えません。');
          throw new Error('Electron API が使えません。window.electron が未定義です。');
        }
        // 費用を追加する
        await window.electron.addExpense(
          description,
          parseFloat(amount), // 金額を数値に変換
          startDate.toLocaleDateString('ja-JP')
        );
        await fetchExpenses(); // データを再取得して表示を更新

        // フォームリセット
        setDescription('');
        setAmount('');
        setStartDate(null);
        setErrorMessage('');
      } catch (err) {
        console.error('追加に失敗しました:', err);
        setErrorMessage('追加に失敗しました');
      }
    } else {
      // 必須項目が未入力の場合に警告を表示
      setErrorMessage('内容・金額・日付は必須です。');
    }
  };

  const handleUpdateExpense = async () => {
    if (editId !== null && description && amount && startDate) {
      try {
        if (!window.electron || !window.electron.addExpense) {
          throw new Error('Electron API が使えません。window.electron が未定義です。');
        }
        await window.electron.updateExpense(
          editId,
          description,
          parseFloat(amount), // 金額を数値に変換
          startDate.toLocaleDateString('ja-JP')
        );
        await fetchExpenses();
        setEditId(null);
        setDescription('');
        setAmount('');
        setStartDate(null);
        setErrorMessage('');
      } catch (err) {
        console.error('更新に失敗しました:', err);
        setErrorMessage('費用の更新に失敗しました。');
      }
    } else {
      setErrorMessage('編集する費用が選ばれていません。');
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
      setErrorMessage('費用の削除に失敗しました。');
    }
  };

  const startEditing = (expense: Expense) => {
    setEditId(expense.id);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setStartDate(new Date(expense.date));
  };

  const cancelEdit = () => {
    setEditId(null);
    setDescription('');
    setAmount('');
    setStartDate(null);
  };

  // フィルター処理
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    // 完全一致検索の場合
    if (searchType === 'exact' && filterDate) {
      const selectedDate = filterDate.toLocaleDateString('ja-JP');
      const expenseDateFormatted = expenseDate.toLocaleDateString('ja-JP');
      return selectedDate === expenseDateFormatted;
    }

    // 範囲指定検索の場合
    if (searchType === 'range') {
      if (rangeStartDate && rangeEndDate) {
        return expenseDate >= rangeStartDate && expenseDate <= rangeEndDate;
      }
      if (rangeStartDate && !rangeEndDate) {
        return expenseDate >= rangeStartDate;
      }
      if (!rangeStartDate && rangeEndDate) {
        return expenseDate <= rangeEndDate;
      }
    }

    return true;
  });

  const totalFilteredAmount = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="home-container">
      <Box display="flex" alignItems="center">
        <Typography variant="h5">家計簿</Typography>
        <IconButton style={{ marginLeft: '8px' }}>
          <FilterListIcon />
        </IconButton>
      </Box>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* 固定したいフォーム部分 */}
      <div className="sticky-input-container">
        <div className="input-row">
          <TextField
            label="内容"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`input-field ${editId ? 'editing' : ''}`}
          />
          <TextField
            label="金額"
            variant="outlined"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`input-field ${editId ? 'editing' : ''}`}
          />
          {editId === null ? (
            <Button onClick={handleAddExpense} variant="contained">
              追加
            </Button>
          ) : (
            <>
              <Button onClick={handleUpdateExpense} variant="contained" color="primary">
                更新
              </Button>
              <Button onClick={cancelEdit} variant="outlined" color="secondary">
                キャンセル
              </Button>
            </>
          )}
        </div>

        <div className="date-picker-row">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
              label="支出日"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{ textField: { className: 'date-picker-input' } }}
            />
          </LocalizationProvider>
        </div>
      </div>

      <hr />

      <h3>
        <IconButton style={{ marginLeft: '8px' }}>
          <MenuIcon />
        </IconButton>
        フィルター
      </h3>

      {/* 以下、フィルターの内容 */}
      <FormControl component="fieldset">
        <FormLabel component="legend">検索タイプ</FormLabel>
        <RadioGroup
          value={searchType}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchType(e.target.value as 'exact' | 'range')
          }
          row
        >
          <FormControlLabel value="exact" control={<Radio />} label="日付で検索（完全一致）" />
          <FormControlLabel value="range" control={<Radio />} label="期間で検索（範囲指定）" />
        </RadioGroup>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        {searchType === 'exact' && (
          <div className="date-picker-row">
            <DatePicker
              label="日付で検索（完全一致）"
              value={filterDate}
              onChange={(date) => setFilterDate(date)}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{ textField: { className: 'date-picker-input' } }}
            />
            <Button
              onClick={() => setFilterDate(null)}
              variant="outlined"
              size="small"
              style={{ marginLeft: 8 }}
            >
              クリア
            </Button>
          </div>
        )}

        {searchType === 'range' && (
          <div className="date-picker-row">
            <DatePicker
              label="開始日"
              value={rangeStartDate}
              onChange={(date) => setRangeStartDate(date)}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{ textField: { className: 'date-picker-input' } }}
            />
            <DatePicker
              label="終了日"
              value={rangeEndDate}
              onChange={(date) => setRangeEndDate(date)}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{ textField: { className: 'date-picker-input' } }}
            />
          </div>
        )}
      </LocalizationProvider>

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

      <h3>合計: ¥{totalFilteredAmount.toLocaleString()}</h3>
    </div>
  );
};

export default Home;
