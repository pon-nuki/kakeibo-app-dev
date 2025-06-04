// src/renderer/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

console.log("preload.ts 実行開始");

try {
  contextBridge.exposeInMainWorld('electron', {
    // Expenses
    fetchExpenses: () => ipcRenderer.invoke('fetchExpenses'),
    deleteExpense: (id: number) => ipcRenderer.invoke('deleteExpense', id),
    addExpense: (description: string, amount: number, date: string) => ipcRenderer.invoke('addExpense', description, amount, date),
    updateExpense: (id: number, desc: string, amt: number, date: string) => ipcRenderer.invoke('updateExpense', { id, desc, amt, date }),

    // Budgets
    getBudget: (month: string) => ipcRenderer.invoke('getBudget', month),
    setBudget: (data: { month: string; amount: number }) => ipcRenderer.invoke('setBudget', data),
    getExpensesTotal: (month: string) => ipcRenderer.invoke('getExpensesTotal', month),

    // Fixed Costs
    fetchFixedCosts: () => ipcRenderer.invoke('fetchFixedCosts'),
    addFixedCost: (description: string, amount: number, date: string) => ipcRenderer.invoke('addFixedCost', description, amount, date),
    updateFixedCost: (id: number, desc: string, amt: number, date: string) => ipcRenderer.invoke('updateFixedCost', { id, desc, amt, date }),
    deleteFixedCost: (id: number) => ipcRenderer.invoke('deleteFixedCost', id),
  });

  console.log("preload.ts 完了");
} catch (err) {
  console.error('preload.ts でエラー:', err);
}
