import { Category } from '../../types/common';

// 環境判定
const isDev = process.env.NODE_ENV === 'development';

// 開発環境ではAPIを呼び出し、本番環境ではElectron APIを使用
export const fetchCategories = async (): Promise<Category[]> => {
  if (isDev) {
    // 開発環境ならlocalhost:3000へHTTP fetch
    try {
      const response = await fetch('http://localhost:3000/categories');
      if (!response.ok) throw new Error('カテゴリの取得に失敗しました');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('データの取得に失敗しました。');
    }
  } else {
    // 本番環境はElectronのAPI呼び出しに切り替え
    if (!window.electron || !window.electron.fetchCategories) {
      throw new Error('Electron API が使えません。');
    }
    try {
      const categories = await window.electron.fetchCategories();
      return categories;
    } catch (error) {
      throw new Error('カテゴリの取得に失敗しました。');
    }
  }
};

// カテゴリを追加する関数
export const addCategory = async (name: string) => {
  if (!window.electron || !window.electron.addCategory) {
    throw new Error('Electron API が使えません。');
  }
  try {
    await window.electron.addCategory(name);
  } catch (err) {
    throw new Error('カテゴリの追加に失敗しました');
  }
};

// カテゴリを更新する関数
export const updateCategory = async (id: number, name: string) => {
  if (!window.electron || !window.electron.updateCategory) {
    throw new Error('Electron API が使えません。');
  }
  try {
    await window.electron.updateCategory(id, name);
  } catch (err) {
    throw new Error('カテゴリの更新に失敗しました');
  }
};

// カテゴリを削除する関数
export const deleteCategory = async (id: number) => {
  if (!window.electron || !window.electron.deleteCategory) {
    throw new Error('Electron API が使えません。');
  }
  try {
    await window.electron.deleteCategory(id);
  } catch (err) {
    throw new Error('カテゴリの削除に失敗しました');
  }
};
