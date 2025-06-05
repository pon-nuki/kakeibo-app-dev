export interface ExpenseFilterProps {
  searchType: 'exact' | 'range';
  setSearchType: (type: 'exact' | 'range') => void;
  filterDate: Date | null;
  setFilterDate: (date: Date | null) => void;
  rangeStartDate: Date | null;
  setRangeStartDate: (date: Date | null) => void;
  rangeEndDate: Date | null;
  setRangeEndDate: (date: Date | null) => void;
}