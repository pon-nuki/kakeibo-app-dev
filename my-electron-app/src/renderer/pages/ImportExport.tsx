import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ImportExport() {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');
  const [filePath, setFilePath] = useState('');
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    setStatus(t('importExport.exporting'));
    try {
      const result = await window.electron.exportCsv();
      setStatus(result?.message || t('importExport.export_success'));
    } catch (err) {
      console.error(err);
      setStatus(t('importExport.export_failed'));
    }
  };

  const handleSelectFile = async () => {
    const selectedPath = await window.electron.selectCsvFile();
    if (selectedPath) {
      setFilePath(selectedPath);
      setStatus('');
    }
  };

  const handleImport = async () => {
    if (!filePath || importing) return;

    setImporting(true);
    setStatus(t('importExport.importing'));

    try {
      const result = await window.electron.importCsv(filePath);
      setStatus(result?.message || t('importExport.import_success'));
    } catch (err) {
      console.error(err);
      setStatus(t('importExport.import_failed'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('importExport.import_export')}</h1>

      {/* エクスポート */}
      <div className="mb-4">
        <Button onClick={handleExport} variant="contained">
          {t('importExport.export_csv')}
        </Button>
      </div>

      {/* インポート */}
      <div className="mb-4 space-x-2">
        <Button onClick={handleSelectFile} variant="outlined">
          {t('importExport.select_csv')}
        </Button>
        {filePath && <span className="text-sm text-gray-500">{filePath}</span>}
      </div>
      <div className="mb-4">
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!filePath || importing}
        >
          {importing ? t('importExport.importing') : t('importExport.import_csv')}
        </Button>
      </div>

      <div className="text-gray-600">{status}</div>
    </div>
  );
}
