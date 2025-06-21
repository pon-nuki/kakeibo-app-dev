import React, { useEffect, useState } from 'react';
import { getCategoryName } from '../../../utils/labels';
import './FixedCostSummary.css';
import { FixedCostSummaryProps } from '../../../types/fixedCostSummary';
import { useTranslation } from 'react-i18next';
import CurrencyAmount from '../CurrencyAmount/CurrencyAmount';

const allowedCurrencies = ['JPY', 'USD', 'RUB'] as const;
type CurrencyCode = typeof allowedCurrencies[number];

const FixedCostSummary: React.FC<FixedCostSummaryProps> = ({ fixedCosts, categories, totalVariable }) => {
  const { t } = useTranslation();
  const [currency, setCurrency] = useState<CurrencyCode>('JPY');

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

  const totalFixed = fixedCosts.reduce((sum, fc) => sum + fc.amount, 0);
  const grandTotal = totalVariable + totalFixed;

  return (
    <div className="fixed-costs-section">
      <h4>{t('fixedCostSummary.title')}</h4>
      {fixedCosts.length === 0 ? (
        <p>{t('fixedCostSummary.noData')}</p>
      ) : (
        fixedCosts.map(fc => (
          <div key={fc.id} className="fixed-cost-item">
            {fc.description}（{getCategoryName(fc, categories)}）: <CurrencyAmount amount={fc.amount} currencyCode={currency} />
          </div>
        ))
      )}
      <div className="fixed-costs-totals">
        {t('fixedCostSummary.totalFixed')}: <CurrencyAmount amount={totalFixed} currencyCode={currency} /><br />
        {t('fixedCostSummary.totalCombined')}: <CurrencyAmount amount={grandTotal} currencyCode={currency} />
      </div>
    </div>
  );
};

export default FixedCostSummary;
