# Kakeibo App (In Development)

> Elevate your finances, ignite your future — a budgeting app like no other!  
> 収支を爆上げ！未来を変える家計簿、ここに誕生！  
> Поднимите финансы и зажгите будущее — уникальное приложение для бюджета!

---

## 行動規範 / Code of Conduct

- [日本語](./CODE_OF_CONDUCT.md)
- [English](./CODE_OF_CONDUCT.en.md)
- [Русский](./CODE_OF_CONDUCT.ru.md)

---

###  Extended Intro / イントロ追加 / Расширенное вступление

**🇬🇧 English**  
Tired of managing your finances? That era is over.  
With this single app, you can track your spending, set your budget, visualize your trends, and even reflect through journaling — all in one place.  
Powered by blazing-fast Go in the backend, smart Python analysis, and a snappy UI built with modern React + TypeScript.  
Local-first. No cloud. No worries.

**🇯🇵 日本語**  
 家計管理、めんどくさい？もうそんな時代は終わりです。  
このアプリひとつで「収支の記録」「予算の把握」「グラフで可視化」「日記で気持ちの整理」――全部できる！  
しかもバックエンドには爆速の Go、分析には賢い Python、UI は最新の React + TypeScript。サクサク快適！  
PC だけで完結。クラウド不要。完全ローカル＆安心設計！

**🇷🇺 Русский**  
 Устали от сложного управления финансами? Это в прошлом.  
Это приложение объединяет всё: учёт расходов, контроль бюджета, наглядные графики и даже дневник для отражения мыслей.  
Скоростной Go на бэкенде, умный Python для анализа и современный интерфейс на React + TypeScript.  
Всё локально. Без облаков. Без стресса.

---

## 支出傾向分析 / Shopping Trend Analysis / Анализ расходов

**English**  
The app can locally analyze your browsing history to detect potential shopping-related visits (e.g., Amazon, Rakuten).  
This helps you identify hidden spending habits and manage your budget better.  
※ All analysis is performed **locally** and **never sent externally**. Your privacy is 100% respected.

**日本語**  
Amazon や楽天など、ショッピング系サイトの閲覧履歴をローカルで分析して「支出傾向」を可視化します。  
知らず知らずの出費を把握して、よりよい予算管理へ。  
※ **すべての処理はローカルで実行**され、**外部に送信されることは一切ありません**。プライバシーは完全に保護されます。

**Русский**  
Приложение может локально анализировать вашу историю просмотров, чтобы выявить посещения сайтов покупок (например, Amazon, Rakuten).  
Это помогает понять скрытые расходы и лучше управлять бюджетом.  
※ Весь анализ выполняется **локально**, **ничего не отправляется во внешние сети**. Ваша конфиденциальность полностью защищена.

---

### Database Auto-Backup / 自動DBバックアップ / Автоматическое резервное копирование БД

**🇬🇧 English**  
The app automatically backs up your local database once per day (on first launch).  
The backup system is written in lightweight **C language** for fast and direct file operations, ensuring high performance and reliability.  
Backups are stored locally in the `AppData/Roaming/kakeibo/backup` folder and rotated after 30 days.

**🇯🇵 日本語**  
本アプリでは、初回起動時に **ローカルのデータベースを自動でバックアップ** します（1日1回）。  
バックアップ機能は軽量で高速な **C言語** によって実装されており、直接ファイル操作を行うことで、高い信頼性とパフォーマンスを実現しています。  
バックアップは `AppData/Roaming/kakeibo/backup` フォルダに保存され、30日後に自動削除されます。

**🇷🇺 Русский**  
Приложение автоматически создает резервную копию локальной базы данных один раз в день (при первом запуске).  
Механизм резервного копирования реализован на **языке C** — это обеспечивает высокую скорость и надежность благодаря прямому управлению файлами.  
Резервные копии хранятся локально в папке `AppData/Roaming/kakeibo/backup` и удаляются через 30 дней.

---

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

**Kakeibo App** is a personal budgeting application built with React, Electron, TypeScript, Node.js, Go, and SQLite.

- English: A power-packed budgeting app that grows with your lifestyle.
- 日本語: 支出管理を爆上げ！誰でも使える多機能家計簿アプリ。
- Русский: Лёгкий и мощный способ управлять своими финансами с удовольствием.

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

- React
- TypeScript
- Electron
- Node.js
- SQLite
- Go
- Python
- C
- CSS
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
├─ python/
│  └─ history_analyzer.py
├─ resources/
│  ├─ exporter.exe
│  ├─ importer.exe
│  └─ db_backup.exe
├─ c-backup-tool/
│  ├─ db_backup.c
│  ├─ db_backup.exe
│  └─ Makefile
├─ server.js
├─ webpack.config.js
└─ package.json
```

---

## License / ライセンス / Лицензия

MIT License
