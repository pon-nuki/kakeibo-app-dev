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

      // 日記管理
      fetchDiaries: () => Promise<Diary[]>;
      getDiaryByDate: (date: string) => Promise<Diary | null>;
      upsertDiary: (date: string, content: string, mood: number | null, tags: string[] | null) => Promise<void>;
      deleteDiary: (date: string) => Promise<DeleteResult>;

      // グラフ
      getCategorySummary: () => Promise<{ category: string; total: number }[]>;
      getMonthlySpending: () => Promise<{ month: string; total: number }[]>;
      getBudgetVsActual: () => Promise<{ month: string; budget: number; actual: number }[]>;
    };
  }
}

export {};
