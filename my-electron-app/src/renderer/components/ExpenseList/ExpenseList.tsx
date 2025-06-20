import React, { useState, useEffect } from 'react';
import { List } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './ExpenseList.css';
import Pagination from '../Pagination/PaginationControls';
import { ExpenseListProps } from '../../../types/expenseListTypes';
import { Expense } from '../../../types/common';
import { useTranslation } from 'react-i18next';
import CurrencyAmount from '../CurrencyAmount/CurrencyAmount';

const allowedCurrencies = ['JPY', 'USD', 'RUB'] as const;
type CurrencyCode = typeof allowedCurrencies[number];

const ITEMS_PER_PAGE = 10;

const ExpenseList: React.FC<ExpenseListProps> = ({
  filteredExpenses,
  startEditing,
  handleDeleteExpense,
  editId,
  categories,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currency, setCurrency] = useState<CurrencyCode>('JPY');
  const { t } = useTranslation();

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
        console.error('通貨設定の取得エラー:', err);
        setCurrency('JPY');
      }
    };
    fetchCurrency();
  }, []);

  const pageCount = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getCategoryName = (expense: Expense): string => {
    if (expense.categoryId) {
      const category = categories.find((cat) => cat.id === expense.categoryId);
      return category ? category.name : t('expenseList.unassigned');
    }
    return t('expenseList.unassigned');
  };

  return (
    <div>
      <List className="expense-list">
        <div className="expense-list-header">
          <div className="col col-description">{t('expenseList.description')}</div>
          <div className="col col-amount">{t('expenseList.amount')}</div>
          <div className="col col-date">{t('expenseList.date')}</div>
          <div className="col col-category">{t('expenseList.category')}</div>
          <div className="col col-actions">{t('expenseList.actions')}</div>
        </div>

        {selectedExpenses.map((expense) => (
          <div
            key={expense.id}
            className={`expense-list-item ${editId === expense.id ? 'editing-item' : ''}`}
          >
            <div className="col col-description">{expense.description}</div>
            <div className="col col-amount">
              <CurrencyAmount amount={expense.amount} currencyCode={currency} />
            </div>
            <div className="col col-date">{expense.date}</div>
            <div className="col col-category">{getCategoryName(expense)}</div>
            <div className="col col-actions">
              <button
                className="icon-button edit"
                title={t('actions.edit')}
                onClick={() => startEditing(expense)}
              >
                <EditIcon />
              </button>

              <button
                className="icon-button delete"
                title={t('actions.delete')}
                onClick={() => handleDeleteExpense(expense.id)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </List>

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ExpenseList;
