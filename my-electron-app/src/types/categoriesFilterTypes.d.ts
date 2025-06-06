import { Category } from './categoriesListTypes';

export interface CategoriesFilterProps {
  searchType: 'exact' | 'range';
  setSearchType: (type: 'exact' | 'range') => void;
  filterDate: Date | null;
  setFilterDate: (date: Date | null) => void;
  rangeStartDate: Date | null;
  setRangeStartDate: (date: Date | null) => void;
  rangeEndDate: Date | null;
  setRangeEndDate: (date: Date | null) => void;
  categories: Category[]; // カテゴリのリスト
  categoryId: number; // 現在選択されているカテゴリID
  setCategoryId: (id: number) => void; // カテゴリID変更時に呼ばれる関数
}
