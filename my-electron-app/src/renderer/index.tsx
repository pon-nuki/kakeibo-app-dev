// index.tsx の最初に nonce を設定
(window as any).__webpack_nonce__ = 'abc123'; // webpack 用の nonce 設定

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// nonce を window から取得する方法
const nonce = (window as any).__webpack_nonce__ || 'abc123'; // window から取得して、fallback 値を指定

const cache = createCache({ key: 'mui', nonce });

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <CacheProvider value={cache}>
    <App />
  </CacheProvider>
);
