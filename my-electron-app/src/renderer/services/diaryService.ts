import { Diary } from '../../types/common.d';

const isDev = process.env.NODE_ENV === 'development';

// 日記をすべて取得（一覧用）
export const fetchDiaries = async (): Promise<Diary[]> => {
  if (isDev) {
    try {
      const response = await fetch(`http://localhost:3000/diaries`);
      if (!response.ok) throw new Error('日記一覧の取得に失敗しました');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('日記一覧の取得に失敗しました');
    }
  } else {
    if (!window.electron?.fetchDiaries) {
      throw new Error('Electron API fetchDiaries が使えません。');
    }
    return await window.electron.fetchDiaries();
  }
};

// 指定日の日記を取得
export async function getDiaryByDate(date: string): Promise<{ content: string } | null> {
  if (isDev) {
    try {
      const response = await fetch(`http://localhost:3000/diary?date=${date}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      return null;
    }
  } else {
    if (!window.electron?.getDiaryByDate) {
      throw new Error('Electron API getDiaryByDate が使えません。');
    }
    return await window.electron.getDiaryByDate(date);
  }
}

// 日記を登録・更新（upsert）
export const upsertDiary = async (
  date: string,
  content: string,
  mood: number | null = null,
  tags: string[] | null = null
): Promise<void> => {
  if (!window.electron?.upsertDiary) {
    throw new Error('Electron API upsertDiary が使えません。');
  }
  await window.electron.upsertDiary(date, content, mood, tags);
};

// 日記を削除
export const deleteDiary = async (date: string): Promise<boolean> => {
  if (!window.electron?.deleteDiary) {
    throw new Error('Electron API deleteDiary が使えません。');
  }
  const result = await window.electron.deleteDiary(date);
  return result.changes > 0;
};
