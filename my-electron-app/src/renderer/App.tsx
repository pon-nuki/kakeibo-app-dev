import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import Budget from './pages/Budget';
import FixedCosts from './pages/FixedCosts';

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/fixed-costs" element={<FixedCosts />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
