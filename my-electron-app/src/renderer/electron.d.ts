// src/renderer/electron.d.ts
import { Expense, FixedCost, DeleteResult } from '../types/index';

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
      addFixedCost: (description: string, amount: number, startDate: string, paymentMethod: string) => Promise<void>;
      updateFixedCost: (id: number, description: string, amount: number, startDate: string, paymentMethod: string) => Promise<void>;
      deleteFixedCost: (id: number) => Promise<DeleteResult>;
    };
  }
}

export {};
