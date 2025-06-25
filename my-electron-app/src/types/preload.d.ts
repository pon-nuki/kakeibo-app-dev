export {};

declare global {
  interface ShoppingHistoryItem {
    date: string;
    category: string;
    amount: number;
    description?: string;
  }

  interface Window {
    electron: {
      getShoppingHistory: () => Promise<ShoppingHistoryItem[]>;
      runHistoryAnalysis: () => Promise<any>;
      getSetting: (key: string) => Promise<{ value: string } | null>;
    };
  }
}
