import React, { useEffect, useState } from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  const [autoRegister, setAutoRegister] = useState<boolean>(true);
  const [notifyFixedCost, setNotifyFixedCost] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const autoResult = await window.electron.getSetting('autoRegisterFixedCosts');
        const notifyResult = await window.electron.getSetting('notifyFixedCost');

        console.log('取得した設定値:', {
          autoRegisterFixedCosts: autoResult.value,
          notifyFixedCost: notifyResult.value,
        });

        // autoRegisterの設定値
        setAutoRegister(autoResult.value === 'true');

        // notifyの設定値
        setNotifyFixedCost(notifyResult.value === 'true');

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
    try {
      await window.electron.setSetting('autoRegisterFixedCosts', checked.toString());
    } catch (err) {
      console.error('自動登録の設定保存エラー:', err);
    }
  };

  const handleToggleNotify = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setNotifyFixedCost(checked);
    try {
      await window.electron.setSetting('notifyFixedCost', checked.toString());
    } catch (err) {
      console.error('通知設定の保存エラー:', err);
    }
  };

  return (
    <div className="home-container">
      <div className="header-wrapper">
        <h2 className="header-title">設定</h2>
        <p>ここではアプリの設定を行えます。</p>
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <>
          <div className="input-row">
            <label htmlFor="autoToggle" className="toggle-label">毎月自動で固定費を登録</label>
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
            <label htmlFor="notifyToggle" className="toggle-label">固定費支払日前に通知を受け取る</label>
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
        </>
      )}
    </div>
  );
};

export default Settings;
