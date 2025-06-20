import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchBudget, saveBudget, fetchTotalExpensesForMonth } from '../services/budgetService';
import './Budget.css';

const BudgetPage: React.FC = () => {
  const navigate = useNavigate(); 
  const { t } = useTranslation();

  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [budget, setBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [inputBudget, setInputBudget] = useState<string>('0');

  useEffect(() => {
    const fetchData = async () => {
      const b = await fetchBudget(month);
      const e = await fetchTotalExpensesForMonth(month);
      setBudget(b?.amount ?? 0);
      setExpenses(e);
      setInputBudget((b?.amount ?? 0).toString());
    };
    fetchData();
  }, [month]);

  const handleSave = async () => {
    const amount = parseFloat(inputBudget);
    if (isNaN(amount)) {
      alert(t('budget.invalidAmountAlert'));
      return;
    }
    await saveBudget(month, amount);
    setBudget(amount);
  };

  return (
    <div className="budget-container">
      <h1>{t('budget.title')}</h1>
      <label className="month-label">
        {t('budget.selectMonth')}:
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="month-input"
        />
      </label>

      <div className="summary">
        <p>{t('budget.setBudget')}: ¥{budget.toLocaleString()}</p>
        <p>{t('budget.totalExpenses')}: ¥{expenses.toLocaleString()}</p>
        <p>{t('budget.difference')}: ¥{(budget - expenses).toLocaleString()}</p>
      </div>

      <div className="input-group">
        <input
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
