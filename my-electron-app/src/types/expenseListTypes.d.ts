import { Expense } from '../../../types/common.d';

export interface ExpenseListProps {
  filteredExpenses: Expense[];
  startEditing: (expense: Expense) => void;
  handleDeleteExpense: (id: number) => void;
  editId: number | null;
  categories: { id: number; name: string }[];
}
