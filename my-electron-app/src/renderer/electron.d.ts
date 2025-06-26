// src/renderer/electron.d.ts
import { Expense, FixedCost, DeleteResult, Category } from '../types/common';
import { ShoppingHistoryItem } from '../types/shoppingHistoryItem';

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
      addFixedCost: (description: string, amount: number, startDate: string, nextPaymentDate: string, paymentMethod: string, categoryId: number, frequency: string) => Promise<void>;
      updateFixedCost: (id: number, description: string, amount: number, startDate: string, nextPaymentDate: string, paymentMethod: string, categoryId: number, frequency: string) => Promise<void>;
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

      // 固定費の自動登録
      autoRegisterFixedCosts: () => Promise<void>;

      // 設定取得・保存
      getSetting: (key: string) => Promise<{ key: string; value: string | null }>;
      setSetting: (key: string, value: string) => Promise<{ message: string; key: string; value: string }>;

      // デフォルトカテゴリの挿入
      insertDefaultCategories: () => Promise<{ success: boolean; error?: string }>;

      // デフォルト設定の挿入
      insertDefaultSettings: () => Promise<{ success: boolean; error?: string }>;

      // CSVエクスポート
       exportCsv: () => Promise<{ message: string }>;

      // CSVインポート
      importCsv: (filePath: string) => Promise<{ message: string }>;

      // CSVファイル選択ダイアログ
      selectCsvFile: () => Promise<string>;

      // 支出傾向
      getShoppingHistory: () => Promise<ShoppingHistoryItem[]>;

      // DBバックアップ
      runDbBackup: () => Promise<string>;

      // 月末警告
      runMonthEndAlert: () => Promise<void>;
    };
  }
}

export {};
