// src/renderer/services/graphsService.ts
import { CategorySummary, MonthlySpending, BudgetVsActual } from '../../types/common.d';

const isDev = process.env.NODE_ENV === 'development';

// カテゴリ別支出合計を取得
export const getCategorySummary = async (): Promise<CategorySummary[]> => {
  if (isDev) {
    try {
      const response = await fetch('http://localhost:3000/category-summary');
      if (!response.ok) throw new Error('カテゴリ別支出合計の取得に失敗しました');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('カテゴリ別支出合計の取得に失敗しました。');
    }
  } else {
    if (!window.electron || !window.electron.getCategorySummary) {
      throw new Error('Electron API が使えません。');
    }
    try {
      const result = await window.electron.getCategorySummary();
      return result;
    } catch (error) {
      throw new Error('カテゴリ別支出合計の取得に失敗しました。');
    }
  }
};

// 月別支出合計を取得
export const getMonthlySpending = async (): Promise<MonthlySpending[]> => {
  if (isDev) {
    try {
      const response = await fetch('http://localhost:3000/monthly-spending');
      if (!response.ok) throw new Error('月別支出合計の取得に失敗しました');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('月別支出合計の取得に失敗しました。');
    }
  } else {
    if (!window.electron || !window.electron.getMonthlySpending) {
      throw new Error('Electron API が使えません。');
    }
    try {
      const result = await window.electron.getMonthlySpending();
      return result;
    } catch (error) {
      throw new Error('月別支出合計の取得に失敗しました。');
    }
  }
};

// 予算と実支出の比較を取得
export const getBudgetVsActual = async (): Promise<BudgetVsActual[]> => {
  if (isDev) {
    try {
      const response = await fetch('http://localhost:3000/budget-vs-actual');
      if (!response.ok) throw new Error('予算と実支出の比較の取得に失敗しました');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('予算と実支出の比較の取得に失敗しました。');
    }
  } else {
    if (!window.electron || !window.electron.getBudgetVsActual) {
      throw new Error('Electron API が使えません。');
    }
    try {
      const result = await window.electron.getBudgetVsActual();
      return result;
    } catch (error) {
      throw new Error('予算と実支出の比較の取得に失敗しました。');
    }
  }
};
