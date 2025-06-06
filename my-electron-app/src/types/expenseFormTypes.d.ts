export interface ExpenseFormProps {
  description: string;
  amount: string;
  startDate: Date | null;
  editId: number | null;
  selectedCategory: number | null;
  categories: { id: number; name: string }[];
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onDescriptionChange: (description: string) => void;
  onAmountChange: (amount: string) => void;
  onStartDateChange: (date: Date | null) => void;
  onCategoryChange: (categoryId: number | null) => void;
}