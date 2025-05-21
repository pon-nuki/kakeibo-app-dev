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

interface ExpenseFilterProps {
  searchType: 'exact' | 'range';
  setSearchType: (type: 'exact' | 'range') => void;
  filterDate: Date | null;
  setFilterDate: (date: Date | null) => void;
  rangeStartDate: Date | null;
  setRangeStartDate: (date: Date | null) => void;
  rangeEndDate: Date | null;
  setRangeEndDate: (date: Date | null) => void;
}

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
  return (
    <div className="expense-filter-container">
      <h3>フィルター</h3>

      <FormControl component="fieldset">
        <FormLabel component="legend">検索タイプ</FormLabel>
        <RadioGroup
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'exact' | 'range')}
          row
        >
          <FormControlLabel value="exact" control={<Radio />} label="日付で検索（完全一致）" />
          <FormControlLabel value="range" control={<Radio />} label="期間で検索（範囲指定）" />
        </RadioGroup>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        {searchType === 'exact' && (
          <div className="date-picker-row">
            <DatePicker
              enableAccessibleFieldDOMStructure={false}
              label="日付で検索（完全一致）"
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
              クリア
            </Button>
          </div>
        )}

        {searchType === 'range' && (
          <div className="date-picker-row">
            <DatePicker
              enableAccessibleFieldDOMStructure={false}
              label="開始日"
              value={rangeStartDate}
              onChange={setRangeStartDate}
              slots={{ textField: TextField }}
            />
            <DatePicker
              enableAccessibleFieldDOMStructure={false}
              label="終了日"
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
