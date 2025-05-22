// services/expenseService.ts

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

// 費用を取得する関数
export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await fetch('http://localhost:3000/expenses');
    if (!response.ok) throw new Error('データ取得に失敗しました');
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('データの取得に失敗しました。');
  }
};

// 費用を追加する関数
export const addExpense = async (
  description: string,
  amount: number,
  startDate: string
) => {
  if (!window.electron || !window.electron.addExpense) {
    throw new Error('Electron API が使えません。');
  }
  try {
    await window.electron.addExpense(description, amount, startDate);
  } catch (err) {
    throw new Error('追加に失敗しました');
  }
};

// 費用を更新する関数
export const updateExpense = async (
  editId: number,
  description: string,
  amount: number,
  startDate: string
) => {
  if (!window.electron || !window.electron.updateExpense) {
    throw new Error('Electron API が使えません。');
  }
  try {
    await window.electron.updateExpense(editId, description, amount, startDate);
  } catch (err) {
    throw new Error('費用の更新に失敗しました。');
  }
};

// 費用を削除する関数
export const deleteExpense = async (id: number) => {
  try {
    const resultMessage = await window.electron.deleteExpense(id);
    if (resultMessage.message.includes('削除されました')) {
      return true;
    } else {
      throw new Error(resultMessage.message);
    }
  } catch (error) {
    throw new Error('費用の削除に失敗しました。');
  }
};
