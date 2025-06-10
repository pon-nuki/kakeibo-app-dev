import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, TextField, Button, Alert,
  FormLabel, Tabs, Tab, Paper
} from '@mui/material';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import './Diary.css';
import { getDiaryByDate, upsertDiary, deleteDiary } from '../services/diaryService';

const Diary: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [tab, setTab] = useState(0); // 0 = 編集, 1 = プレビュー

  useEffect(() => {
    const loadDiary = async (date: string) => {
      try {
        const entry = await getDiaryByDate(date);
        setContent(entry?.content || '');
        setMessage(null);
      } catch {
        setMessage('日記の読み込みに失敗しました');
      }
    };
    loadDiary(selectedDate);
  }, [selectedDate]);

  const handleSave = async () => {
    try {
      await upsertDiary(selectedDate, content);
      setMessage('保存しました');
    } catch {
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
    } catch {
      setMessage('削除に失敗しました');
    }
  };

  const renderedMarkdown = useMemo(() => {
    const rawHtml = marked.parse(content) as string;
    return { __html: DOMPurify.sanitize(rawHtml) };
  }, [content]);

  return (
    <div className="diary-container">
      <Typography variant="h5" gutterBottom>日記</Typography>

      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

      <FormLabel htmlFor="date-input" sx={{ mb: 1 }}>日付</FormLabel>
      <TextField
        id="date-input"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ mb: 2 }}>
        <Tab label="編集" />
        <Tab label="プレビュー" />
      </Tabs>

      {tab === 0 ? (
        <TextField
          label="内容（Markdown対応）"
          multiline
          rows={10}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
      ) : (
        <Paper variant="outlined" sx={{ p: 2, mb: 2, minHeight: 200 }}>
          <div dangerouslySetInnerHTML={renderedMarkdown} />
        </Paper>
      )}

      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={handleSave} color="primary">保存</Button>
        <Button variant="outlined" onClick={handleDelete} color="error">削除</Button>
      </Box>
    </div>
  );
};

export default Diary;
