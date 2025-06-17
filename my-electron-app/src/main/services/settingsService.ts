import { getSettingValue, setSettingValue } from '../../main/db';

// 設定を取得する関数（文字列）
export const getSetting = async (key: string): Promise<string | null> => {
  try {
    const value = await getSettingValue(key);
    if (value !== null) {
      console.log(`設定取得: ${key} = ${value}`);
    } else {
      console.log(`設定取得: ${key} は未設定`);
    }
    return value;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`設定の取得に失敗しました (${key}):`, error.message);
    } else {
      console.error(`設定の取得に失敗しました (${key}): 不明なエラー`);
    }
    return null;
  }
};

// 設定を保存する関数（文字列）
export const setSetting = async (key: string, value: string): Promise<void> => {
  try {
    await setSettingValue(key, value);
    console.log(`設定保存: ${key} = ${value}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`設定の保存に失敗しました (${key}):`, error.message);
    } else {
      console.error(`設定の保存に失敗しました (${key}): 不明なエラー`);
    }
  }
};

// 設定を取得する関数
export const getBooleanSetting = async (key: string, defaultValue = false): Promise<boolean> => {
  const value = await getSetting(key);
  return value === null ? defaultValue : value === 'true';
};

// 設定を保存する関数
export const setBooleanSetting = async (key: string, value: boolean): Promise<void> => {
  await setSetting(key, value ? 'true' : 'false');
};
