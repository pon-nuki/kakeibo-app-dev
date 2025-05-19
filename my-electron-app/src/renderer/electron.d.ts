// src/renderer/electron.d.ts
export {};
interface DeleteResult {
  message: string;
  changes: number;
}

declare global {
  interface Window {
    electron: {
      deleteMessage: (id: number) => Promise<DeleteResult>;
      addExpense: (description: string, amount: number) => Promise<void>;
      updateExpense: (id: number, description: string, amount: number) => Promise<void>;
    };
  }
}
