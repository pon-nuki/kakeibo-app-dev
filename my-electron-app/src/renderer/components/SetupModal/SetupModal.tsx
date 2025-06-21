// SetupModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from '@mui/material';

const SetupModal: React.FC = () => {
  const [language, setLanguage] = useState('ja');
  const [currency, setCurrency] = useState('JPY');

  const handleSave = async () => {
    try {
      await window.electron.setSetting('language', language);
      await window.electron.setSetting('currency', currency);
      await window.electron.setSetting('initialized', 'true');
      // カテゴリを言語に応じて挿入
      await window.electron.insertDefaultCategories();
      // 通貨や通知設定などの初期化
      await window.electron.insertDefaultSettings();
      // 完了後にアプリをリロード
      window.location.reload();
    } catch (err) {
      console.error('初期設定保存エラー:', err);
    }
  };

  return (
    <Dialog open>
      <DialogTitle>初期設定</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="言語"
          fullWidth
          margin="normal"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <MenuItem value="ja">日本語</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ru">Русский</MenuItem>
        </TextField>

        <TextField
          select
          label="通貨"
          fullWidth
          margin="normal"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <MenuItem value="JPY">円 (JPY)</MenuItem>
          <MenuItem value="USD">ドル (USD)</MenuItem>
          <MenuItem value="RUB">ルーブル (RUB)</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetupModal;
