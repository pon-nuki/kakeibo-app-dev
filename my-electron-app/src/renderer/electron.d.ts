// src/renderer/electron.d.ts
import { Expense, FixedCost, DeleteResult, Category } from '../types/common.d';

declare global {
  interface Window {
    electron: {
      // 通常の費用
      fetchExpenses: () => Promise<Expense[]>;
      deleteExpense: (id: number) => Promise<DeleteResult>;
      addExpense: (description: string, amount: number, startDate: string, categoryId: number) => Promise<void>;
      updateExpense: (id: number, description: string, amount: number, startDate: string, categoryId: number) => Promise<void>;

      // 予算管理
      getBudget: (month: string) => Promise<number | null>;
      setBudget: (params: { month: string; amount: number }) => Promise<void>;
      getExpensesTotal: (month: string) => Promise<number>;

      // 固定費
      fetchFixedCosts: () => Promise<FixedCost[]>;
      addFixedCost: (description: string, amount: number, startDate: string, paymentMethod: string, categoryId: number) => Promise<void>;
      updateFixedCost: (id: number, description: string, amount: number, startDate: string, paymentMethod: string, categoryId: number) => Promise<void>;
      deleteFixedCost: (id: number) => Promise<DeleteResult>;

      // カテゴリ管理
      fetchCategories: () => Promise<Category[]>;
      addCategory: (name: string) => Promise<void>;
      updateCategory: (id: number, name: string) => Promise<void>;
      deleteCategory: (id: number) => Promise<DeleteResult>;
    };
  }
}

export {};
