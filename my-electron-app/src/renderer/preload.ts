import { contextBridge, ipcRenderer } from 'electron';

console.log("preload.ts 実行開始");

try {
  contextBridge.exposeInMainWorld('electron', {
    // Expenses
    fetchExpenses: () => ipcRenderer.invoke('fetchExpenses'),
    deleteExpense: (id: number) => ipcRenderer.invoke('deleteExpense', id),
    addExpense: (description: string, amount: number, date: string, categoryId: number) =>
      ipcRenderer.invoke('addExpense', description, amount, date, categoryId),
    updateExpense: (id: number, desc: string, amt: number, date: string, categoryId: number) =>
      ipcRenderer.invoke('updateExpense', { id, desc, amt, date, categoryId }),

    // Budgets
    getBudget: (month: string) => ipcRenderer.invoke('getBudget', month),
    setBudget: (data: { month: string; amount: number }) => ipcRenderer.invoke('setBudget', data),
    getExpensesTotal: (month: string) => ipcRenderer.invoke('getExpensesTotal', month),

    // Fixed Costs
    fetchFixedCosts: () => ipcRenderer.invoke('fetchFixedCosts'),
    addFixedCost: (
      description: string,
      amount: number,
      startDate: string,
      nextPaymentDate: string,
      paymentMethod: string,
      categoryId: number,
      frequency: string
    ) =>
      ipcRenderer.invoke(
        'addFixedCost',
        description,
        amount,
        startDate,
        nextPaymentDate,
        paymentMethod,
        categoryId,
        frequency
      ),
    updateFixedCost: (
      id: number,
      description: string,
      amount: number,
      startDate: string,
      nextPaymentDate: string,
      paymentMethod: string,
      categoryId: number,
      frequency: string
    ) =>
      ipcRenderer.invoke('updateFixedCost', {
        id,
        description,
        amount,
        startDate,
        nextPaymentDate,
        paymentMethod,
        categoryId,
        frequency,
      }),
    deleteFixedCost: (id: number) => ipcRenderer.invoke('deleteFixedCost', id),

    // Categories
    fetchCategories: () => ipcRenderer.invoke('fetchCategories'),
    addCategory: (name: string) => ipcRenderer.invoke('addCategory', name),
    updateCategory: (id: number, name: string) => ipcRenderer.invoke('updateCategory', { id, name }),
    deleteCategory: (id: number) => ipcRenderer.invoke('deleteCategory', id),

    // Diary
    fetchDiaries: () => ipcRenderer.invoke('fetchDiaries'),
    getDiaryByDate: (date: string) => ipcRenderer.invoke('getDiaryByDate', date),
    upsertDiary: (date: string, content: string, mood: number | null, tags: string[] | null) =>
      ipcRenderer.invoke('upsertDiary', { date, content, mood, tags }),
    deleteDiary: (date: string) => ipcRenderer.invoke('deleteDiary', date),

    // Graph
    getCategorySummary: () => ipcRenderer.invoke('getCategorySummary'),
    getMonthlySpending: () => ipcRenderer.invoke('getMonthlySpending'),
    getBudgetVsActual: () => ipcRenderer.invoke('getBudgetVsActual'),

    // Auto Register Fixed Costs
    autoRegisterFixedCosts: () => ipcRenderer.invoke('autoRegisterFixedCosts'),

    // Settings
    getSetting: (key: string) => ipcRenderer.invoke('getSetting', key),
    setSetting: (key: string, value: string) => ipcRenderer.invoke('setSetting', key, value),

    // Settings (booleanを文字列に変換する)
    getBooleanSetting: async (key: string) => {
      const res = await ipcRenderer.invoke('getSetting', key);
      return res.value === 'true';
    },
    setBooleanSetting: (key: string, value: boolean) =>
      ipcRenderer.invoke('setSetting', key, value ? 'true' : 'false'),

    // 通知設定
    getNotifySetting: () => ipcRenderer.invoke('getSetting', 'notifyFixedCost'),
    setNotifySetting: (enabled: boolean) =>
      ipcRenderer.invoke('setSetting', 'notifyFixedCost', enabled ? 'true' : 'false'),

    // デフォルトカテゴリの挿入
    insertDefaultCategories: () => ipcRenderer.invoke('insertDefaultCategories'),

    // デフォルト設定の挿入
    insertDefaultSettings: () => ipcRenderer.invoke('insertDefaultSettings'),
  });

  console.log("preload.ts 完了");
} catch (err) {
  console.error('preload.ts でエラー:', err);
}
