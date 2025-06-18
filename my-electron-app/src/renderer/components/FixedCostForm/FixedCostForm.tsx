import React, { useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { FixedCostFormProps } from '../../../types/fixedCostFormTypes';
import { addMonths } from 'date-fns';
import './FixedCostForm.css';

const FixedCostForm: React.FC<FixedCostFormProps> = ({
  description,
  amount,
  paymentMethod,
  categories,
  selectedCategory,
  frequency,
  startDate,
  nextPaymentDate,
  editId,
  onDescriptionChange,
  onAmountChange,
  onPaymentMethodChange,
  onCategoryChange,
  onFrequencyChange,
  onStartDateChange,
  onNextPaymentDateChange,
  onSubmit,
  onCancel,
}) => {
  useEffect(() => {
    if (startDate) {
      let nextDate = startDate;
      if (frequency === 'monthly') {
        nextDate = addMonths(startDate, 1);
      } else if (frequency === 'quarterly') {
        nextDate = addMonths(startDate, 3);
      } else if (frequency === 'annually') {
        nextDate = addMonths(startDate, 12);
      }
      onNextPaymentDateChange(nextDate);
    }
  }, [startDate, frequency, onNextPaymentDateChange]);

  return (
    <div className="home-container">
      <div className="input-row">
        <TextField
          label="固定費名"
          variant="outlined"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="input-field"
        />
        <TextField
          label="金額"
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="input-field"
        />
        <FormControl className="input-field">
          <InputLabel>支払方法</InputLabel>
          <Select
            value={paymentMethod}
            label="支払方法"
            onChange={(e) => onPaymentMethodChange(e.target.value)}
          >
            <MenuItem value="bank">口座振替</MenuItem>
            <MenuItem value="credit">クレジットカード</MenuItem>
            <MenuItem value="cash">現金</MenuItem>
            <MenuItem value="other">その他</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="input-field">
          <InputLabel>カテゴリ</InputLabel>
          <Select
            value={selectedCategory || ''}
            label="カテゴリ"
            onChange={(e) => onCategoryChange(Number(e.target.value))}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="input-field">
          <InputLabel>支払頻度</InputLabel>
          <Select
            value={frequency}
            label="支払頻度"
            onChange={(e) => onFrequencyChange(e.target.value)}
          >
            <MenuItem value="monthly">毎月</MenuItem>
            <MenuItem value="quarterly">三ヶ月毎</MenuItem>
            <MenuItem value="annually">毎年</MenuItem>
            <MenuItem value="other">その他</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <DatePicker
            label="現在の支払日"
            value={startDate}
            onChange={onStartDateChange}
            slotProps={{ textField: { className: 'date-picker-input' } }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <DatePicker
            label="次回支払日"
            value={nextPaymentDate}
            onChange={onNextPaymentDateChange}
            slotProps={{ textField: { className: 'date-picker-input' } }}
          />
        </LocalizationProvider>
        {editId === null ? (
          <Button onClick={onSubmit} variant="contained">
            追加
          </Button>
        ) : (
          <>
            <Button onClick={onSubmit} variant="contained" color="primary">
              更新
            </Button>
            <Button onClick={onCancel} variant="outlined" color="secondary">
              キャンセル
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FixedCostForm;
