// src/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ja from './locales/ja.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

async function detectLanguage(): Promise<string> {
  if (window?.electron?.getSetting) {
    try {
      const res = await window.electron.getSetting('language');
      return res.value || 'ja';
    } catch (e) {
      console.warn('言語設定の取得に失敗したためデフォルトを使用します:', e);
    }
  }
  return 'ja';
}

export async function initI18n() {
  const lng = await detectLanguage();

  await i18n.use(initReactI18next).init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
      ru: { translation: ru }
    },
    lng,
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false
    }
  });

  return i18n;
}
