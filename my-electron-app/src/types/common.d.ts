export interface FixedCost {
  id: number;
  description: string;
  amount: number;
  date: string; // 現在の支払日
  nextPaymentDate: string; // 次回支払日
  paymentMethod: string;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'other'; // 支払頻度
  categoryId: number;
  category: { id: number; name: string };
}

export type Expense = {
  id: number;
  description: string;
  amount: number;
  date: string;
  categoryId: number;
  category: { id: number; name: string };
};

export interface DeleteResult {
  message: string;
  changes: number;
}

export interface Budget {
  id: number;
  month: string; // YYYY-MM
  amount: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Diary {
  id?: number;
  date: string;
  content: string;
  mood: number | null;
  tags: string[] | null;
}

export interface CategorySummary {
  category: string;
  total: number;
}

export interface MonthlySpending {
  month: string;
  total: number;
}

export interface BudgetVsActual {
  month: string;
  budget: number;
  actual: number;
}