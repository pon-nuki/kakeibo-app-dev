import { Expense } from '../../../types/common';

export interface ExpenseListProps {
  filteredExpenses: Expense[];
  startEditing: (expense: Expense) => void;
  handleDeleteExpense: (id: number) => void;
  editId: number | null;
  categories: { id: number; name: string }[];
}
