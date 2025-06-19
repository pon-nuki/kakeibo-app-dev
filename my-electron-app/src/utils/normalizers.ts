// src/utils/normalizers.ts

import { FixedCost } from '../types/common';

export const normalizeFixedCosts = (rows: any[]): FixedCost[] => {
  return rows.map(row => ({
    id: row.id,
    description: row.description,
    amount: row.amount,
    date: row.date,
    nextPaymentDate: row.next_payment_date,
    paymentMethod: row.payment_method,
    frequency: row.frequency,
    categoryId: row.category_id,
    category: {
      id: row.category_id,
      name: row.category_name || 'カテゴリ未設定'
    }
  }));
};
