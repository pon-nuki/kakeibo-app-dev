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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  useEffect(() => {
    if (startDate) {
      let nextDate = startDate;
      if (frequency === 'monthly') nextDate = addMonths(startDate, 1);
      else if (frequency === 'quarterly') nextDate = addMonths(startDate, 3);
      else if (frequency === 'annually') nextDate = addMonths(startDate, 12);
      onNextPaymentDateChange(nextDate);
    }
  }, [startDate, frequency, onNextPaymentDateChange]);

  return (
    <div className="home-container">
      <div className="input-row">
        <TextField
          label={t('fixedCostForm.name')}
          variant="outlined"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="input-field"
        />
        <TextField
          label={t('fixedCostForm.amount')}
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="input-field"
        />
        <FormControl className="input-field">
          <InputLabel>{t('fixedCostForm.paymentMethod')}</InputLabel>
          <Select
            value={paymentMethod}
            label={t('fixedCostForm.paymentMethod')}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
          >
            <MenuItem value="bank">{t('fixedCostForm.method.bank')}</MenuItem>
            <MenuItem value="credit">{t('fixedCostForm.method.credit')}</MenuItem>
            <MenuItem value="cash">{t('fixedCostForm.method.cash')}</MenuItem>
            <MenuItem value="other">{t('fixedCostForm.method.other')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="input-field">
          <InputLabel>{t('fixedCostForm.category')}</InputLabel>
          <Select
            value={selectedCategory || ''}
            label={t('fixedCostForm.category')}
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
          <InputLabel>{t('fixedCostForm.frequency')}</InputLabel>
          <Select
            value={frequency}
            label={t('fixedCostForm.frequency')}
            onChange={(e) => onFrequencyChange(e.target.value)}
          >
            <MenuItem value="monthly">{t('fixedCostForm.freq.monthly')}</MenuItem>
            <MenuItem value="quarterly">{t('fixedCostForm.freq.quarterly')}</MenuItem>
            <MenuItem value="annually">{t('fixedCostForm.freq.annually')}</MenuItem>
            <MenuItem value="other">{t('fixedCostForm.freq.other')}</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <DatePicker
            label={t('fixedCostForm.startDate')}
            value={startDate}
            onChange={onStartDateChange}
            slotProps={{ textField: { className: 'date-picker-input' } }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <DatePicker
            label={t('fixedCostForm.nextPaymentDate')}
            value={nextPaymentDate}
            onChange={onNextPaymentDateChange}
            slotProps={{ textField: { className: 'date-picker-input' } }}
          />
        </LocalizationProvider>
        {editId === null ? (
          <Button onClick={onSubmit} variant="contained">
            {t('common.add')}
          </Button>
        ) : (
          <>
            <Button onClick={onSubmit} variant="contained" color="primary">
              {t('common.update')}
            </Button>
            <Button onClick={onCancel} variant="outlined" color="secondary">
              {t('common.cancel')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FixedCostForm;
