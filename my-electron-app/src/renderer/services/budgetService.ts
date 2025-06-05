// services/budgetService.ts
import { Budget } from '../../types/common.d';

const isDev = process.env.NODE_ENV === 'development';

console.log('isDev:', isDev);
console.log('NODE_ENV:', process.env.NODE_ENV);

// 月別の予算を取得
export const fetchBudget = async (month: string): Promise<Budget | null> => {
  if (isDev) {
    try {
      const response = await fetch(`http://localhost:3000/budget?month=${month}`);
      if (!response.ok) throw new Error('予算の取得に失敗しました');
      const data = await response.json();
      return data ?? null;
    } catch (err) {
      throw new Error('予算の取得に失敗しました');
    }
  } else {
    if (!window.electron?.getBudget) {
      throw new Error('Electron API が使えません。');
    }
    try {
      const amount = await window.electron.getBudget(month);
      return { id: 0, month, amount: amount ?? 0 };
    } catch {
      throw new Error('予算の取得に失敗しました');
    }
  }
};


// 月別の予算を設定・更新
export const saveBudget = async (month: string, amount: number) => {
  if (isDev) {
    try {
      const response = await fetch(`http://localhost:3000/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, amount }),
      });
      if (!response.ok) throw new Error('予算の保存に失敗しました');
    } catch {
      throw new Error('予算の保存に失敗しました');
    }
  } else {
    if (!window.electron || !window.electron.setBudget) {
      throw new Error('Electron API が使えません。');
    }
    try {
      await window.electron.setBudget({ month, amount });
    } catch {
      throw new Error('予算の保存に失敗しました');
    }
  }
};

// 指定月の支出合計を取得
export const fetchTotalExpensesForMonth = async (month: string): Promise<number> => {
  if (isDev) {
    try {
      const response = await fetch(`http://localhost:3000/expenses/total?month=${month}`);
      if (!response.ok) throw new Error('支出合計の取得に失敗しました');
      const data = await response.json();
      return data.total ?? 0;
    } catch (err) {
      throw new Error('支出合計の取得に失敗しました');
    }
  } else {
    if (!window.electron || !window.electron.getExpensesTotal) {
      throw new Error('Electron API が使えません。');
    }
    try {
      return await window.electron.getExpensesTotal(month);
    } catch {
      throw new Error('支出合計の取得に失敗しました');
    }
  }
};


