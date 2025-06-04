// src/renderer/electron.d.ts
export {};

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

interface FixedCost {
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
      // 通常の費用
      fetchExpenses: () => Promise<Expense[]>;
      deleteExpense: (id: number) => Promise<DeleteResult>;
      addExpense: (description: string, amount: number, startDate: string) => Promise<void>;
      updateExpense: (id: number, description: string, amount: number, startDate: string) => Promise<void>;

      // 予算管理
      getBudget: (month: string) => Promise<number | null>;
      setBudget: (params: { month: string; amount: number }) => Promise<void>;
      getExpensesTotal: (month: string) => Promise<number>;

      // 固定費
      fetchFixedCosts: () => Promise<FixedCost[]>;
      addFixedCost: (description: string, amount: number, startDate: string) => Promise<void>;
      updateFixedCost: (id: number, description: string, amount: number, startDate: string) => Promise<void>;
      deleteFixedCost: (id: number) => Promise<DeleteResult>;
    };
  }
}
