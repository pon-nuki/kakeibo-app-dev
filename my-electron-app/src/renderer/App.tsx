import React, { useEffect, Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Settings from './pages/Settings';
import Budget from './pages/Budget';
import FixedCosts from './pages/FixedCosts';
import Categories from './pages/Categories'; 
import ErrorBoundary from './components/ErrorBoundary';
import Diary from './pages/Diary';
import Graphs from './pages/Graphs';
import AppLayout from './components/Layouts/AppLayout';
import SetupModal from './components/SetupModal/SetupModal';
import ImportExport from './pages/ImportExport'; 

const App: React.FC = () => {
  const [initialized, setInitialized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkInitialized = async () => {
      try {
        const result = await window.electron.getSetting('initialized');
        setInitialized(result?.value === 'true');
      } catch {
        setInitialized(false);
      }

      if (window.electron) {
        console.log('electron オブジェクトが存在します');
      } else {
        console.error('electron オブジェクトが見つかりません');
      }
    };

    checkInitialized();
  }, []);

  if (initialized === null) {
    return <div>Loading...</div>; // 読み込み中の表示
  }

  return (
    <ErrorBoundary>
      <AppLayout>
        <Suspense fallback={<div>読み込み中...</div>}>
          {!initialized && <SetupModal />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/fixed-costs" element={<FixedCosts />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/graphs" element={<Graphs />} />
            <Route path="/import-export" element={<ImportExport />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </ErrorBoundary>
  );
};

export default App;
