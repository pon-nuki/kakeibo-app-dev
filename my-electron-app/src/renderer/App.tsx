import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AppLayout from './components/Layouts/AppLayout';

// lazy load
const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));
const Budget = lazy(() => import('./pages/Budget'));
const FixedCosts = lazy(() => import('./pages/FixedCosts'));
const Categories = lazy(() => import('./pages/Categories'));
const Diary = lazy(() => import('./pages/Diary'));
const Graphs = lazy(() => import('./pages/Graphs'));

const App: React.FC = () => {
  useEffect(() => {
    if (window.electron) {
      console.log("electron オブジェクトが存在します");
    } else {
      console.error("electron オブジェクトが見つかりません");
    }
  }, []);

  return (
    <ErrorBoundary>
      <AppLayout>
        <Suspense fallback={<div>読み込み中...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/fixed-costs" element={<FixedCosts />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/graphs" element={<Graphs />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </ErrorBoundary>
  );
};

export default App;
