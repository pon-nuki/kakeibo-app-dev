import React from 'react';
import { getCategoryName } from '../../../utils/labels';
import './FixedCostSummary.css';
import { FixedCostSummaryProps } from '../../../types/fixedCostSummary';
import { useTranslation } from 'react-i18next';

const FixedCostSummary: React.FC<FixedCostSummaryProps> = ({ fixedCosts, categories, totalVariable }) => {
  const { t } = useTranslation();
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
            {fc.description}（{getCategoryName(fc, categories)}）: ¥{fc.amount.toLocaleString()}
          </div>
        ))
      )}
      <div className="fixed-costs-totals">
        {t('fixedCostSummary.totalFixed')}: ¥{totalFixed.toLocaleString()}<br />
        {t('fixedCostSummary.totalCombined')}: ¥{grandTotal.toLocaleString()}
      </div>
    </div>
  );
};

export default FixedCostSummary;
