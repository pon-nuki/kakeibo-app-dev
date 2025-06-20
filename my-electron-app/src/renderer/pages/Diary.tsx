import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, Alert,
  FormLabel, Tabs, Tab, Paper, TextField
} from '@mui/material';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Locale } from 'date-fns';
import { ja, enUS, ru } from 'date-fns/locale';
import './Diary.css';
import { getDiaryByDate, upsertDiary, deleteDiary } from '../services/diaryService';

const Diary: React.FC = () => {
  const { t, i18n } = useTranslation();

  const localeMap: Record<string, Locale> = {
    ja: ja,
    en: enUS,
    ru: ru
  };
  const currentLocale = localeMap[i18n.language] || ja;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [tab, setTab] = useState(0); // 0 = 編集, 1 = プレビュー

  useEffect(() => {
    const loadDiary = async (date: Date) => {
      const dateStr = date.toISOString().slice(0, 10);
      try {
        const entry = await getDiaryByDate(dateStr);
        setContent(entry?.content || '');
        setMessage(null);
      } catch {
        setMessage(t('diary.message.loadFailed'));
      }
    };
    loadDiary(selectedDate);
  }, [selectedDate, t]);

  const handleSave = async () => {
    const dateStr = selectedDate.toISOString().slice(0, 10);
    try {
      await upsertDiary(dateStr, content);
      setMessage(t('diary.message.saved'));
    } catch {
      setMessage(t('diary.message.saveFailed'));
    }
  };

  const handleDelete = async () => {
    const dateStr = selectedDate.toISOString().slice(0, 10);
    try {
      const deleted = await deleteDiary(dateStr);
      if (deleted) {
        setContent('');
        setMessage(t('diary.message.deleted'));
      } else {
        setMessage(t('diary.message.deleteFailed'));
      }
    } catch {
      setMessage(t('diary.message.deleteFailed'));
    }
  };

  const renderedMarkdown = useMemo(() => {
    const rawHtml = marked.parse(content) as string;
    return { __html: DOMPurify.sanitize(rawHtml) };
  }, [content]);

  return (
    <div className="diary-container">
      <Typography variant="h5" gutterBottom>{t('diary.title')}</Typography>

      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

      <FormLabel sx={{ mb: 1 }}>{t('diary.date')}</FormLabel>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
        <DatePicker
          value={selectedDate}
          onChange={(newValue) => {
            if (newValue) setSelectedDate(newValue);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </LocalizationProvider>

      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ my: 2 }}>
        <Tab label={t('diary.editTab')} />
        <Tab label={t('diary.previewTab')} />
      </Tabs>

      {tab === 0 ? (
        <TextField
          label={t('diary.contentLabel')}
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
        <Button variant="contained" onClick={handleSave} color="primary">
          {t('diary.saveButton')}
        </Button>
        <Button variant="outlined" onClick={handleDelete} color="error">
          {t('diary.deleteButton')}
        </Button>
      </Box>
    </div>
  );
};

export default Diary;
