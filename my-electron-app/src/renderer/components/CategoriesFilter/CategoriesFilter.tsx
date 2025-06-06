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
import { ja } from 'date-fns/locale';
import { CategoriesFilterProps } from '../../../types/CategoriesFilterTypes';

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
  setCategoryId
}) => {
  return (
    <div className="expense-filter-container">
      <h3>フィルター</h3>

      {/* カテゴリ選択 */}
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>カテゴリ</InputLabel>
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value as number)}
          label="カテゴリ"
        >
          <MenuItem value={0}>全てのカテゴリ</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 検索タイプのラジオボタン */}
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

      {/* 日付フィルター */}
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

export default CategoriesFilter;
