import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import './Diary.css';
import { getDiaryByDate, upsertDiary, deleteDiary } from '../services/diaryService';
import { FormLabel } from '@mui/material';

const Diary: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);

  // 日記の取得
  const loadDiary = async (date: string) => {
    try {
      const entry = await getDiaryByDate(date);
      if (entry) {
        setContent(entry.content);
      } else {
        setContent('');
      }
      setMessage(null);
    } catch (error) {
      setMessage('日記の読み込みに失敗しました');
    }
  };

  useEffect(() => {
    loadDiary(selectedDate);
  }, [selectedDate]);

  const handleSave = async () => {
    try {
      await upsertDiary(selectedDate, content);
      setMessage('保存しました');
    } catch (err) {
      setMessage('保存に失敗しました');
    }
  };

  const handleDelete = async () => {
    try {
      const deleted = await deleteDiary(selectedDate);
      if (deleted) {
        setContent('');
        setMessage('削除しました');
      } else {
        setMessage('削除に失敗しました');
      }
    } catch (err) {
      setMessage('削除に失敗しました');
    }
  };

  return (
    <div className="diary-container">
    <Typography variant="h5" gutterBottom>日記</Typography>

    {message && <Alert severity="info">{message}</Alert>}
    
    <FormLabel htmlFor="date-input" sx={{ mb: 1 }}>日付</FormLabel>
    <TextField
        id="date-input"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
    />

    <TextField
        label="内容（Markdown可）"
        multiline
        rows={10}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
        variant="outlined"
        sx={{ marginBottom: 2 }}
    />

    <Box display="flex" gap={2}>
        <Button variant="contained" onClick={handleSave} color="primary">保存</Button>
        <Button variant="outlined" onClick={handleDelete} color="error">削除</Button>
    </Box>
    </div>
  );
};

export default Diary;
