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

const FixedCostForm: React.FC<FixedCostFormProps> = ({
  description,
  amount,
  paymentMethod,
  categories,
  selectedCategory,
  frequency,
  startDate, // 現在の支払日
  nextPaymentDate,
  editId,
  onDescriptionChange,
  onAmountChange,
  onPaymentMethodChange,
  onCategoryChange,
  onFrequencyChange,
  onStartDateChange, // 現在の支払日変更
  onNextPaymentDateChange,
  onSubmit,
  onCancel,
}) => {
  // 支払頻度に基づき次回支払日を自動計算
  useEffect(() => {
    if (startDate) {
      let nextDate = startDate;
      if (frequency === 'monthly') {
        nextDate = addMonths(startDate, 1); // 毎月
      } else if (frequency === 'quarterly') {
        nextDate = addMonths(startDate, 3); // 3ヶ月毎
      } else if (frequency === 'annually') {
        nextDate = addMonths(startDate, 12); // 年一回
      }
      onNextPaymentDateChange(nextDate); // 次回支払日を更新
    }
  }, [startDate, frequency, onNextPaymentDateChange]);

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
        {/* 支払頻度 */}
        <FormControl className={`input-field ${editId ? 'editing' : ''}`}>
          <InputLabel>支払頻度</InputLabel>
          <Select
            value={frequency}
            label="支払頻度"
            onChange={(e) => onFrequencyChange(e.target.value)}
          >
            <MenuItem value="monthly">毎月</MenuItem>
            <MenuItem value="quarterly">四半期ごと</MenuItem>
            <MenuItem value="annually">年一回</MenuItem>
            <MenuItem value="other">その他</MenuItem>
          </Select>
        </FormControl>
        {/* 現在の支払日 */}
        <div className="date-picker-row">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
              label="現在の支払日"
              value={startDate}
              onChange={onStartDateChange}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{ textField: { className: 'date-picker-input' } }}
            />
          </LocalizationProvider>
        </div>
        {/* 次回支払日 */}
        <div className="date-picker-row">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
              label="次回支払日"
              value={nextPaymentDate}
              onChange={onNextPaymentDateChange}
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
