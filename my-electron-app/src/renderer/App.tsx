import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';

const App: React.FC = () => {
  useEffect(() => {
    if (window.electron) {
      console.log("electron オブジェクトが存在します");
      // ここでの削除処理は削除しました。
    } else {
      console.error("electron オブジェクトが見つかりません");
    }
  }, []);  // 初回レンダリング時には削除処理を実行しない

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default App;
