# Kakeibo App (In Development)

## Screenshots / スクリーンショット / Скриншоты

### Personal Budget / 家計簿 / Личный бюджет

<p align="center">
  <img src="images/kakeibo.png" alt="Personal Budget screen" width="600" />
</p>

### Journal / 日記 / Дневник

<p align="center">
  <img src="images/nikki.png" alt="Journal screen" width="600" />
</p>

### Category Management / カテゴリ設定 / Управление категориями

<p align="center">
  <img src="images/kategori.png" alt="Category management screen" width="600" />
</p>

### Recurring Expenses / 固定費設定 / Регулярные расходы

<p align="center">
  <img src="images/koteihi.png" alt="Recurring expenses screen" width="600" />
</p>

### Budget Planning / 予算設定 / Планирование бюджета

<p align="center">
  <img src="images/yosan.png" alt="Budget planning screen" width="600" />
</p>

### Analytics (Graphs) / グラフで見る / Аналитика (графики)

<p align="center">
  <img src="images/gurafu.png" alt="Analytics and graphs screen" width="600" />
</p>

### App Settings / アプリ設定 / Настройки приложения

<p align="center">
  <img src="images/settei.png" alt="App settings screen" width="600" />
</p>

---

## Overview / 概要 / Обзор

**Kakeibo App** is a personal budgeting application built with **React**, **Electron**, **TypeScript**, **Node.js**, and **SQLite**.

* *English*: A simple, effective tool for tracking income and expenses.
* *日本語*: 収支を簡単に記録・管理できる家計簿アプリです。
* *Русский*: Простое приложение для ведения личного бюджета.

---

## Development Status / 開発状況 / Статус разработки

* Basic expense tracking implemented
* Fixed cost registration
* Diary feature
* Monthly budget comparison
* Graph-based analytics
* Configurable settings

Planned features:

* Export options (CSV, PDF)
* Password protection
* Cloud sync (TBD)

---

## Tech Stack / 技術構成 / Технологии

* React
* Electron
* TypeScript
* Node.js
* SQLite
* MUI (Material UI)
* Chart.js
* Go

---

## Installation / インストール方法 / Установка

```bash
# Clone the repository / リポジトリをクローン / Клонируйте репозиторий
$ git clone https://github.com/pon-nuki/kakeibo-app-dev.git
$ cd my-electron-app

# Install dependencies / 依存関係のインストール / Установка зависимостей
$ npm install

# Start the application (for development) / アプリを起動（開発用） / Запуск приложения (для разработки)
$ npm run build
$ npm run start

# For production build (if packaging) / 本番ビルド（パッケージ化する場合） / Сборка для продакшн (при упаковке)
$ npm run package
```

---

## Directory Structure / ディレクトリ構成 / Структура проекта

```
my-electron-app/
├─ dist/               # Production build / 本番ビルド / Продакшн сборка
├─ public/             # Static files / 静的ファイル / Статические файлы
├─ src/
│  ├─ main/            # Electron main process / Electronメインプロセス / Главный процесс
│  ├─ renderer/        # React frontend / Reactフロントエンド / Интерфейс
│  ├─ services/        # Business logic / ビジネスロジック / Логика приложения
│  ├─ pages/           # UI pages / 画面ページ / Страницы интерфейса
│  └─ components/      # UI components / UIコンポーネント / Компоненты
├─ go-csv-exporter/    # CSV exporter in Go / Go言語CSVエクスポート / CSV-экспортер на Go
│  ├─ exporter.go      # Main export logic / エクスポートロジック / Основная логика
│  ├─ go.mod           # Go module config / Goモジュール設定 / Конфигурация модуля Go
│  └─ go.sum           # Module checksums / モジュールチェックサム / Контрольные суммы
├─ resources/          # Static executables / exe等の配置 / Внешние ресурсы
│  └─ exporter.exe     # Production-ready Go exporter / 本番用Goエクスポーター / Готовый экспортёр
├─ server.js           # Express backend / バックエンド / Сервер Express
├─ webpack.config.js   # Webpack configuration
└─ package.json        # Scripts and dependencies
```

---

## License / ライセンス / Лицензия

[MIT](./LICENSE)
