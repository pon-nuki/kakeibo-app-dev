import { FixedCost } from '../types/common';

// 支払方法のラベル変換
export const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'bank': return '口座振替';
    case 'credit': return 'クレジットカード';
    case 'cash': return '現金';
    case 'other': return 'その他';
    default: return '不明';
  }
};

// 支払頻度のラベル変換
export const getFrequencyLabel = (frequency: string): string => {
  switch (frequency) {
    case 'monthly': return '毎月';
    case 'quarterly': return '三ヶ月毎';
    case 'annually': return '毎年';
    default: return 'その他';
  }
};

// カテゴリ名を取得
export const getCategoryName = (cost: FixedCost, categories: { id: number; name: string }[]): string => {
  if (cost.categoryId) {
    const category = categories.find((cat) => cat.id === cost.categoryId);
    return category ? category.name : '未設定';
  }
  return '未設定';
};
