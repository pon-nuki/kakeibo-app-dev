import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import './Settings.css';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [autoRegister, setAutoRegister] = useState<boolean>(true);
  const [notifyFixedCost, setNotifyFixedCost] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('ja');
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<string>('JPY');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const autoResult = await window.electron.getSetting('autoRegisterFixedCosts');
        const notifyResult = await window.electron.getSetting('notifyFixedCost');
        const langResult = await window.electron.getSetting('language');
        const currencyResult = await window.electron.getSetting('currency');

        setAutoRegister(autoResult.value === 'true');
        setNotifyFixedCost(notifyResult.value === 'true');
        setLanguage(langResult.value || 'ja');
        setCurrency(currencyResult.value || 'JPY');
        i18n.changeLanguage(langResult.value || 'ja');
      } catch (err) {
        console.error('設定取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggleAutoRegister = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAutoRegister(checked);
    await window.electron.setSetting('autoRegisterFixedCosts', checked.toString());
  };

  const handleToggleNotify = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setNotifyFixedCost(checked);
    await window.electron.setSetting('notifyFixedCost', checked.toString());
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const selectedLang = event.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    window.electron.setSetting('language', selectedLang);
  };

  return (
    <div className="home-container">
      <div className="header-wrapper">
        <h2 className="header-title">{t('settings.title')}</h2>
        <p>{t('settings.description')}</p>
      </div>

      {loading ? (
        <p>{t('settings.loading')}</p>
      ) : (
        <>
          <div className="input-row">
            <label htmlFor="autoToggle" className="toggle-label">{t('settings.autoRegister')}</label>
            <label className="switch">
              <input
                id="autoToggle"
                type="checkbox"
                checked={autoRegister}
                onChange={handleToggleAutoRegister}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="input-row">
            <label htmlFor="notifyToggle" className="toggle-label">{t('settings.notifyFixedCost')}</label>
            <label className="switch">
              <input
                id="notifyToggle"
                type="checkbox"
                checked={notifyFixedCost}
                onChange={handleToggleNotify}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="input-row">
            <label htmlFor="language-select" className="toggle-label">
              {t('settings.language')}：
            </label>
            <FormControl size="small" style={{ minWidth: 160 }}>
              <Select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
              >
                <MenuItem value="ja">日本語</MenuItem>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ru">Русский</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="input-row">
            <label htmlFor="currency-select" className="toggle-label">
              {t('settings.currency')}：
            </label>
            <FormControl size="small" style={{ minWidth: 160 }}>
              <Select
                id="currency-select"
                value={currency}
                onChange={(e) => {
                  const selected = e.target.value;
                  setCurrency(selected);
                  window.electron.setSetting('currency', selected);
                }}
              >
                <MenuItem value="JPY">¥ 日本円</MenuItem>
                <MenuItem value="USD">$ USドル</MenuItem>
                <MenuItem value="RUB">₽ ロシアルーブル</MenuItem>
              </Select>
            </FormControl>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
