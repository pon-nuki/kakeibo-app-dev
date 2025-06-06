import { Category } from './categoriesListTypes.d';

export interface CategoriesFormProps {
  description: string;
  amount: string;
  startDate: Date | null;
  categoryId: number | null;
  categories: Category[];
  editId: number | null;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onDescriptionChange: (description: string) => void;
  onAmountChange: (amount: string) => void;
  onStartDateChange: (date: Date | null) => void;
  onCategoryChange: (categoryId: number) => void;
}
