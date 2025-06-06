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
  editId,
  onSubmit,
  onCancel,
  onDescriptionChange,
  onAmountChange,
  onStartDateChange,
  onPaymentMethodChange
}) => {
  return (
    <div>
      <div className="input-row">
        <TextField
          label="固定費名"
          variant="outlined"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className={`input-field ${editId ? 'editing' : ''}`}
        />
        <TextField
          label="金額"
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className={`input-field ${editId ? 'editing' : ''}`}
        />
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
    </div>
  );
};

export default FixedCostForm;
