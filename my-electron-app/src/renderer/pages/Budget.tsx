import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchBudget, saveBudget, fetchTotalExpensesForMonth } from '../services/budgetService';
import './Budget.css';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Locale } from 'date-fns';
import { ja, enUS, ru } from 'date-fns/locale';
import { TextField } from '@mui/material';
import CurrencyAmount from '../components/CurrencyAmount/CurrencyAmount';

const BudgetPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const localeMap: Record<string, Locale> = {
    ja,
    en: enUS,
    ru
  };
  const currentLocale = localeMap[i18n.language] || ja;

  const allowedCurrencies = ['JPY', 'USD', 'RUB'] as const;
  type CurrencyCode = typeof allowedCurrencies[number];
  const [month, setMonth] = useState<Date>(new Date());
  const [budget, setBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [inputBudget, setInputBudget] = useState<string>('0');
  const [currency, setCurrency] = useState<CurrencyCode>('JPY');

  const fetchData = async (date: Date) => {
    const isoMonth = date.toISOString().slice(0, 7);
    const b = await fetchBudget(isoMonth);
    const e = await fetchTotalExpensesForMonth(isoMonth);
    setBudget(b?.amount ?? 0);
    setExpenses(e);
    setInputBudget((b?.amount ?? 0).toString());
  };

useEffect(() => {
  const fetchCurrency = async () => {
    try {
      const result = await window.electron.getSetting('currency');
      const value = result.value;
      if (allowedCurrencies.includes(value as CurrencyCode)) {
        setCurrency(value as CurrencyCode);
      } else {
        setCurrency('JPY');
      }
    } catch (err) {
      console.error('通貨取得エラー:', err);
      setCurrency('JPY');
    }
  };

  fetchCurrency();
}, []);

  useEffect(() => {
    fetchData(month);
  }, [month]);

  const handleSave = async () => {
    const amount = parseFloat(inputBudget);
    if (isNaN(amount)) {
      alert(t('budget.invalidAmountAlert'));
      return;
    }
    const isoMonth = month.toISOString().slice(0, 7);
    await saveBudget(isoMonth, amount);
    setBudget(amount);
  };

  return (
    <div className="budget-container">
      <h1>{t('budget.title')}</h1>

      <div className="month-picker">
        <label className="month-label">{t('budget.selectMonth')}</label>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
          <DatePicker
            views={['year', 'month']}
            value={month}
            onChange={(newDate) => {
              if (newDate) setMonth(newDate);
            }}
            slotProps={{ textField: { size: 'small', className: 'month-input' } }}
          />
        </LocalizationProvider>
      </div>

      <div className="summary">
        <p>{t('budget.setBudget')}: <CurrencyAmount amount={budget} currencyCode={currency} /></p>
        <p>{t('budget.totalExpenses')}: <CurrencyAmount amount={expenses} currencyCode={currency} /></p>
        <p>{t('budget.difference')}: <CurrencyAmount amount={budget - expenses} currencyCode={currency} /></p>
      </div>

      <div className="input-group">
        <TextField
          type="number"
          value={inputBudget}
          onChange={(e) => setInputBudget(e.target.value)}
          placeholder={t('budget.enterBudget')}
          className="budget-input"
        />
        <button onClick={handleSave} className="save-button">
          {t('budget.saveBudget')}
        </button>
      </div>
    </div>
  );
};

export default BudgetPage;
