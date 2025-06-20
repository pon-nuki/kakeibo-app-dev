import React from 'react';
import {
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { ExpenseFormProps } from '../../../types/expenseFormTypes';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <div>
      <div className="input-row">
        <TextField
          label={t('expenseForm.description')}
          variant="outlined"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          fullWidth
          className={`input-field ${editId ? 'editing' : ''}`}
        />
        <TextField
          label={t('expenseForm.amount')}
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          fullWidth
          className={`input-field ${editId ? 'editing' : ''}`}
        />
      </div>

      <div className="input-row">
        <TextField
          label={t('expenseForm.category')}
          variant="outlined"
          select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(Number(e.target.value))}
          fullWidth
          className={`input-field ${editId ? 'editing' : ''}`}
        >
          <MenuItem value="">
            <em>{t('expenseForm.selectCategory')}</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="date-picker-row">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <DatePicker
            label={t('expenseForm.date')}
            value={startDate}
            onChange={onStartDateChange}
            enableAccessibleFieldDOMStructure={false}
            slots={{ textField: TextField }}
            slotProps={{ textField: { className: 'date-picker-input' } }}
          />
        </LocalizationProvider>
      </div>

      <div className="button-row">
        {editId === null ? (
          <Button onClick={onSubmit} variant="contained" fullWidth>
            {t('expenseForm.add')}
          </Button>
        ) : (
          <>
            <Button onClick={onSubmit} variant="contained" color="primary" fullWidth>
              {t('expenseForm.update')}
            </Button>
            <Button onClick={onCancel} variant="outlined" color="secondary" fullWidth>
              {t('expenseForm.cancel')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseForm;
