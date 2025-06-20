import React from 'react';
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { enUS, ja, ru } from 'date-fns/locale';
import { Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { CategoriesFilterProps } from '../../../types/categoriesFilterTypes';

const localeMap: Record<string, Locale> = {
  ja,
  en: enUS,
  ru,
};

const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  searchType,
  setSearchType,
  filterDate,
  setFilterDate,
  rangeStartDate,
  setRangeStartDate,
  rangeEndDate,
  setRangeEndDate,
  categories,
  categoryId,
  setCategoryId,
}) => {
  const { t, i18n } = useTranslation();
  const currentLocale = localeMap[i18n.language] || enUS;

  return (
    <div className="expense-filter-container">
      <h3>{t('filter.title')}</h3>

      {/* カテゴリ選択 */}
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>{t('expenseForm.category')}</InputLabel>
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value as number)}
          label={t('expenseForm.category')}
        >
          <MenuItem value={0}>{t('expenseForm.selectCategory')}</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 検索タイプのラジオボタン */}
      <FormControl component="fieldset">
        <FormLabel component="legend">{t('filter.searchType')}</FormLabel>
        <RadioGroup
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'exact' | 'range')}
          row
        >
          <FormControlLabel value="exact" control={<Radio />} label={t('filter.exact')} />
          <FormControlLabel value="range" control={<Radio />} label={t('filter.range')} />
        </RadioGroup>
      </FormControl>

      {/* 日付フィルター */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
        {searchType === 'exact' && (
          <div className="date-picker-row">
            <DatePicker
              label={t('filter.exact')}
              value={filterDate}
              onChange={setFilterDate}
              slots={{ textField: TextField }}
              enableAccessibleFieldDOMStructure={false}
            />
            <Button
              onClick={() => setFilterDate(null)}
              variant="outlined"
              size="small"
              style={{ marginLeft: 8 }}
            >
              {t('filter.clear')}
            </Button>
          </div>
        )}

        {searchType === 'range' && (
          <div className="date-picker-row">
            <DatePicker
              label={t('filter.start')}
              value={rangeStartDate}
              onChange={setRangeStartDate}
              slots={{ textField: TextField }}
              enableAccessibleFieldDOMStructure={false}
            />
            <DatePicker
              label={t('filter.end')}
              value={rangeEndDate}
              onChange={setRangeEndDate}
              slots={{ textField: TextField }}
              enableAccessibleFieldDOMStructure={false}
            />
          </div>
        )}
      </LocalizationProvider>
    </div>
  );
};

export default CategoriesFilter;
