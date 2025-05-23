import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';  // Router は使わない
import Home from './pages/Home'; 
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';

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
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
