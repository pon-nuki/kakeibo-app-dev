import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Settings from './pages/Settings';
import Budget from './pages/Budget';
import FixedCosts from './pages/FixedCosts';
import Categories from './pages/Categories'; 
import ErrorBoundary from './components/ErrorBoundary';
import Diary from './pages/Diary';
import AppLayout from './components/Layouts/AppLayout';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/fixed-costs" element={<FixedCosts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/diary" element={<Diary />} />
        </Routes>
      </AppLayout>
    </ErrorBoundary>
  );
};

export default App;
