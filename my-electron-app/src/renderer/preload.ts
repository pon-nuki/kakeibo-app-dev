import { contextBridge, ipcRenderer } from 'electron';

console.log("preload.ts 実行開始");

try {
  contextBridge.exposeInMainWorld('electron', {
    deleteMessage: (id: number) => ipcRenderer.invoke('deleteMessage', id),
    addExpense: (description: string, amount: number) => ipcRenderer.invoke('addExpense', description, amount),
  });

  console.log("preload.ts 完了");
} catch (err) {
  console.error('preload.ts でエラー:', err);
}
