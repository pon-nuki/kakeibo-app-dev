// src/renderer/electron.d.ts
export {};

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

interface DeleteResult {
  message: string;
  changes: number;
}

declare global {
  interface Window {
    electron: {
      fetchExpenses: () => Promise<Expense[]>;
      deleteExpense: (id: number) => Promise<DeleteResult>;
      addExpense: (description: string, amount: number, startDate: string) => Promise<void>;
      updateExpense: (id: number, description: string, amount: number, startDate: string) => Promise<void>;

      getBudget: (month: string) => Promise<number | null>;
      setBudget: (params: { month: string; amount: number }) => Promise<void>;
      getExpensesTotal: (month: string) => Promise<number>;
    };
  }
}
