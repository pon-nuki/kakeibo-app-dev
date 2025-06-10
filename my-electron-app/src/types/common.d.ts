export interface FixedCost {
  id: number;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
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
