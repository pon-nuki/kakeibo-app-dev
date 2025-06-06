import React from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { CategoriesFormProps } from '../../../types/categoriesFormTypes';
import { Category } from '../../../types/common';

const CategoriesForm: React.FC<CategoriesFormProps> = ({
  description,
  amount,
  startDate,
  categoryId,
  categories,
  editId,
  onSubmit,
  onCancel,
  onDescriptionChange,
  onAmountChange,
  onStartDateChange,
  onCategoryChange
}) => {
  return (
    <div>
      <div className="input-row">
        <TextField
          label="内容"
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
      </div>

      <div className="category-select-row">
        <FormControl fullWidth variant="outlined">
          <InputLabel>カテゴリ</InputLabel>
          <Select
            value={categoryId || ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            label="カテゴリ"
            className={`input-field ${editId ? 'editing' : ''}`}
          >
            {categories.map((category: Category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

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

      <div className="action-buttons">
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

export default CategoriesForm;
