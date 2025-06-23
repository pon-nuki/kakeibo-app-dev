// src/renderer/pages/ImportExport.tsx
import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ImportExport() {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');

  const handleExport = async () => {
    setStatus(t('exporting'));
    try {
      const result = await window.electron.exportCsv();
      setStatus(result?.message || t('importExport.export_success'));
    } catch (err) {
      console.error(err);
      setStatus(t('export_failed'));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('importExport.import_export')}</h1>

      <div className="mb-4">
        <Button onClick={handleExport}>{t('importExport.export_csv')}</Button>
      </div>

      <div className="text-gray-600">{status}</div>

      <hr className="my-6" />

      <div className="text-gray-400 italic">{t('importExport.import_coming_soon')}</div>
    </div>
  );
}
