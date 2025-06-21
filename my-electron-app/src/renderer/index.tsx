// webpack 用の nonce 設定
(window as any).__webpack_nonce__ = 'abc123';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import { initI18n } from '../i18n/i18n'; 

// nonce を window から取得
const nonce = (window as any).__webpack_nonce__ || 'abc123';
const cache = createCache({ key: 'mui', nonce });

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// 言語初期化が終わってから描画
initI18n().then(() => {
  root.render(
    <CacheProvider value={cache}>
      <HashRouter>
        <App />
      </HashRouter>
    </CacheProvider>
  );
});
