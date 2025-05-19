import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// createRoot を使用してレンダリング
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
    <App />
);
