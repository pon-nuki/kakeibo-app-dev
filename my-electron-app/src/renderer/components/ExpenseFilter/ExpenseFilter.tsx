import React from 'react';
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { ExpenseFilterProps } from '../../../types/expenseFilterTypes';
import { useTranslation } from 'react-i18next';

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({
  searchType,
  setSearchType,
  filterDate,
  setFilterDate,
  rangeStartDate,
  setRangeStartDate,
  rangeEndDate,
  setRangeEndDate,
}) => {
  const { t } = useTranslation();

  return (
    <div className="expense-filter-container">
      <h3>{t('filter.title')}</h3>

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

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        {searchType === 'exact' && (
          <div className="date-picker-row">
            <DatePicker
              enableAccessibleFieldDOMStructure={false}
              label={t('filter.exact')}
              value={filterDate}
              onChange={setFilterDate}
              slots={{ textField: TextField }}
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
              enableAccessibleFieldDOMStructure={false}
              label={t('filter.start')}
              value={rangeStartDate}
              onChange={setRangeStartDate}
              slots={{ textField: TextField }}
            />
            <DatePicker
              enableAccessibleFieldDOMStructure={false}
              label={t('filter.end')}
              value={rangeEndDate}
              onChange={setRangeEndDate}
              slots={{ textField: TextField }}
            />
          </div>
        )}
      </LocalizationProvider>
    </div>
  );
};

export default ExpenseFilter;
