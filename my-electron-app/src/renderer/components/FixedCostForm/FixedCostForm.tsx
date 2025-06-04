// src/renderer/components/FixedCostForm/FixedCostForm.tsx
import React from 'react';
import {
  Button,
  TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';

interface FixedCostFormProps {
  description: string;
  amount: string;
  startDate: Date | null;
  editId: number | null;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onDescriptionChange: (description: string) => void;
  onAmountChange: (amount: string) => void;
  onStartDateChange: (date: Date | null) => void;
}

const FixedCostForm: React.FC<FixedCostFormProps> = ({
  description,
  amount,
  startDate,
  editId,
  onSubmit,
  onCancel,
  onDescriptionChange,
  onAmountChange,
  onStartDateChange
}) => {
  return (
    <div className="sticky-input-container">
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
            label="適用日"
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
