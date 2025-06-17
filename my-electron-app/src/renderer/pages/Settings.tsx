import React, { useEffect, useState } from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  const [autoRegister, setAutoRegister] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const result = await window.electron.getSetting('autoRegisterFixedCosts');
        console.log('取得した設定値:', result.value);
        if (result.value !== null) {
          if (typeof result.value === 'boolean') {
            setAutoRegister(result.value);
          } else if (typeof result.value === 'string') {
            setAutoRegister(result.value === 'true');
          } else {
            setAutoRegister(false);
          }
        }
      } catch (err) {
        console.error('設定取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, []);

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAutoRegister(checked);
    try {
      await window.electron.setSetting('autoRegisterFixedCosts', checked.toString());
    } catch (err) {
      console.error('設定保存エラー:', err);
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
        <div className="input-row">
          <label htmlFor="toggle" className="toggle-label">毎月自動で固定費を登録</label>
          <label className="switch">
            <input
              id="toggle"
              type="checkbox"
              checked={autoRegister}
              onChange={handleToggle}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}
    </div>
  );
};

export default Settings;
