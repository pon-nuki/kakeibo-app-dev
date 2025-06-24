# Kakeibo App

## Screenshots / スクリーンショット / Скриншоты

### Personal Budget / 家計簿 / Личный бюджет
- images/kakeibo.png

### Journal / 日記 / Дневник
- images/nikki.png

### Category Management / カテゴリ設定 / Управление категориями
- images/kategori.png

### Recurring Expenses / 固定費設定 / Регулярные расходы
- images/koteihi.png

### Budget Planning / 予算設定 / Планирование бюджета
- images/yosan.png

### Analytics / グラフで見る / Аналитика
- images/gurafu.png

### App Settings / アプリ設定 / Настройки приложения
- images/settei.png

---

## Overview / 概要 / Обзор

**Kakeibo App** is a personal budgeting application built with React, Electron, TypeScript, Node.js, Go, and SQLite.

- English: A next-level budgeting app that grows with you.
- 日本語: 収支を爆上げ管理！多機能かつ直感的な家計簿アプリ。
- Русский: Приложение для бюджета, которое вдохновляет на финансовый успех.

---

## Development Status / 開発状況 / Статус разработки

- Expense tracking with performance-focused input
- Recurring costs with flexible scheduling
- Multi-language journal with mood and tags
- Monthly budget goals with visual graphs
- Graph-based insights and breakdowns
- Fully configurable settings screen

Planned Features:
- CSV & PDF export/import
- Secure password login
- Optional cloud sync for backups

---

## Tech Stack / 技術構成 / Технологии

- React + TypeScript
- Electron
- Node.js
- SQLite
- Go
- MUI
- Chart.js

---

## Installation / インストール方法 / Установка

```bash
git clone https://github.com/pon-nuki/kakeibo-app-dev.git
cd my-electron-app
npm install
npm run build
npm run start
# パッケージ化する場合
npm run package
```

---

## Directory Structure / ディレクトリ構成 / Структура проекта

```
my-electron-app/
├─ dist/
├─ public/
├─ src/
│  ├─ main/
│  ├─ renderer/
│  ├─ services/
│  ├─ pages/
│  └─ components/
├─ go-csv-exporter/
│  ├─ exporter.go
│  ├─ go.mod
│  └─ go.sum
├─ go-csv-importer/
│  ├─ importer.go
│  ├─ go.mod
│  └─ go.sum
├─ resources/
│  ├─ exporter.exe
│  └─ importer.exe
├─ server.js
├─ webpack.config.js
└─ package.json
```

---

## License / ライセンス / Лицензия

MIT License
