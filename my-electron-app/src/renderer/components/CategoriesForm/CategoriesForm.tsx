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
import { ja, enUS, ru } from 'date-fns/locale';
import { CategoriesFormProps } from '../../../types/categoriesFormTypes';
import { Category } from '../../../types/common';
import { Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

  const localeMap: Record<string, Locale> = {
    ja: ja,
    en: enUS,
    ru: ru
  };
  const currentLocale = localeMap[i18n.language] || ja;

  return (
    <div>
      <div className="input-row">
        <TextField
          label={t('expenseForm.description')}
          variant="outlined"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className={`input-field ${editId ? 'editing' : ''}`}
        />
        <TextField
          label={t('expenseForm.amount')}
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className={`input-field ${editId ? 'editing' : ''}`}
        />
      </div>

      <div className="category-select-row">
        <FormControl fullWidth variant="outlined">
          <InputLabel>{t('expenseForm.category')}</InputLabel>
          <Select
            value={categoryId || ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            label={t('expenseForm.category')}
            className={`input-field ${editId ? 'editing' : ''}`}
          >
            <MenuItem value="">
              <em>{t('expenseForm.selectCategory')}</em>
            </MenuItem>
            {categories.map((category: Category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="date-picker-row">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
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

      <div className="action-buttons">
        {editId === null ? (
          <Button onClick={onSubmit} variant="contained">
            {t('expenseForm.add')}
          </Button>
        ) : (
          <>
            <Button onClick={onSubmit} variant="contained" color="primary">
              {t('expenseForm.update')}
            </Button>
            <Button onClick={onCancel} variant="outlined" color="secondary">
              {t('expenseForm.cancel')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriesForm;
