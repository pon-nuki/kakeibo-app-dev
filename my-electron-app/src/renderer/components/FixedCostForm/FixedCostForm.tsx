import React from 'react';
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

const FixedCostForm: React.FC<FixedCostFormProps> = ({
  description,
  amount,
  startDate,
  paymentMethod,
  categories,
  selectedCategory,
  editId,
  onDescriptionChange,
  onAmountChange,
  onStartDateChange,
  onPaymentMethodChange,
  onCategoryChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <div>
      <div className="input-row">
        {/* 固定費名 */}
        <TextField
          label="固定費名"
          variant="outlined"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className={`input-field ${editId ? 'editing' : ''}`}
        />
        {/* 金額 */}
        <TextField
          label="金額"
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className={`input-field ${editId ? 'editing' : ''}`}
        />
        {/* 支払方法 */}
        <FormControl className={`input-field ${editId ? 'editing' : ''}`}>
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
        {/* カテゴリ選択 */}
        <FormControl className={`input-field ${editId ? 'editing' : ''}`}>
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
        {/* 支払日 */}
        <div className="date-picker-row">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
              label="支払日"
              value={startDate}
              onChange={onStartDateChange}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{ textField: { className: 'date-picker-input' } }}
            />
          </LocalizationProvider>
        </div>
        {/* 追加・更新ボタン */}
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
