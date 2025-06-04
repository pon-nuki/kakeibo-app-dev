import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {fetchBudget, saveBudget, fetchTotalExpensesForMonth} from '../services/budgetService';
import './Budget.css';

const BudgetPage: React.FC = () => {
  const navigate = useNavigate(); 
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
      alert('有効な数値を入力してください');
      return;
    }
    await saveBudget(month, amount);
    setBudget(amount);
  };

  return (
    <div className="budget-container">
      <h1>月別予算管理</h1>
      <label className="month-label">
        設定月:
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="month-input"
        />
      </label>

      <div className="summary">
        <p>設定済み予算: ¥{budget.toLocaleString()}</p>
        <p>支出合計: ¥{expenses.toLocaleString()}</p>
        <p>差額: ¥{(budget - expenses).toLocaleString()}</p>
      </div>

      <div className="input-group">
        <input
          type="number"
          value={inputBudget}
          onChange={(e) => setInputBudget(e.target.value)}
          placeholder="予算を入力"
          className="budget-input"
        />
        <button onClick={handleSave} className="save-button">予算を保存</button>
      </div>
    </div>
  );
};

export default BudgetPage;
