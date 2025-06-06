import React from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { ExpenseFormProps } from '../../../types/expenseFormTypes';

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  description,
  amount,
  startDate,
  editId,
  selectedCategory,
  categories,
  onSubmit,
  onCancel,
  onDescriptionChange,
  onAmountChange,
  onStartDateChange,
  onCategoryChange,
}) => {
  return (
    <div>
      <div className="input-row">
        <TextField
          label="内容"
          variant="outlined"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          fullWidth
          className={`input-field ${editId ? 'editing' : ''}`}
        />
        <TextField
          label="金額"
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          fullWidth
          className={`input-field ${editId ? 'editing' : ''}`}
        />
      </div>
      {/* カテゴリ選択 */}
      <div className="input-row">
        <TextField
          label="カテゴリ"
          variant="outlined"
          select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(Number(e.target.value))}
          fullWidth
          className={`input-field ${editId ? 'editing' : ''}`}
        >
          <MenuItem value="">
            <em>カテゴリを選択</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </div>
      {/* 支払日 */}
      <div className="date-picker-row">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <DatePicker
            label="支出日"
            value={startDate}
            onChange={onStartDateChange}
            enableAccessibleFieldDOMStructure={false}
            slots={{ textField: TextField }}
            slotProps={{ textField: { className: 'date-picker-input' } }}
          />
        </LocalizationProvider>
      </div>
      {/* 送信・キャンセルボタン */}
      <div className="button-row">
        {editId === null ? (
          <Button onClick={onSubmit} variant="contained" fullWidth>
            追加
          </Button>
        ) : (
          <>
            <Button onClick={onSubmit} variant="contained" color="primary" fullWidth>
              更新
            </Button>
            <Button onClick={onCancel} variant="outlined" color="secondary" fullWidth>
              キャンセル
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseForm;
