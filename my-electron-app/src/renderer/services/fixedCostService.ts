import { FixedCost } from '../../types/common';

const isDev = process.env.NODE_ENV === 'development';

// 固定費一覧を取得
export const fetchFixedCosts = async (): Promise<FixedCost[]> => {
  if (isDev) {
    try {
      const response = await fetch('http://localhost:3000/fixed-costs');
      if (!response.ok) throw new Error('固定費の取得に失敗しました');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('固定費の取得に失敗しました。');
    }
  } else {
    if (!window.electron || !window.electron.fetchFixedCosts) {
      throw new Error('Electron API が使えません。');
    }
    try {
      const fixedCosts = await window.electron.fetchFixedCosts();
      return fixedCosts;
    } catch (error) {
      throw new Error('固定費の取得に失敗しました。');
    }
  }
};

// 固定費を追加
export const addFixedCost = async (
  description: string,
  amount: number,
  startDate: string,
  nextPaymentDate: string,
  paymentMethod: string,
  categoryId: number,
  frequency: 'monthly' | 'quarterly' | 'annually' | 'other' // 支払頻度
) => {
  if (!window.electron || !window.electron.addFixedCost) {
    throw new Error('Electron API が使えません。');
  }
  try {
    await window.electron.addFixedCost(description, amount, startDate, nextPaymentDate, paymentMethod, categoryId, frequency);
  } catch (err) {
    throw new Error('固定費の追加に失敗しました');
  }
};

// 固定費を更新
export const updateFixedCost = async (
  editId: number,
  description: string,
  amount: number,
  startDate: string,
  nextPaymentDate: string,
  paymentMethod: string,
  categoryId: number,
  frequency: 'monthly' | 'quarterly' | 'annually' | 'other' // 支払頻度
) => {
  if (!window.electron || !window.electron.updateFixedCost) {
    throw new Error('Electron API が使えません。');
  }
  try {
    await window.electron.updateFixedCost(editId, description, amount, startDate, nextPaymentDate, paymentMethod, categoryId, frequency);
  } catch (err) {
    throw new Error('固定費の更新に失敗しました。');
  }
};

// 固定費を削除
export const deleteFixedCost = async (id: number) => {
  try {
    const resultMessage = await window.electron.deleteFixedCost(id);
    if (resultMessage.message.includes('削除されました')) {
      return true;
    } else {
      throw new Error(resultMessage.message);
    }
  } catch (error) {
    throw new Error('固定費の削除に失敗しました。');
  }
};
