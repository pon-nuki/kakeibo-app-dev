export interface FixedCost {
  id: number;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export interface DeleteResult {
  message: string;
  changes: number;
}

export interface Budget {
  id: number;
  month: string; // YYYY-MM
  amount: number;
}
