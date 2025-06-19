import React from 'react';
import { getCategoryName } from '../../../utils/labels';
import './FixedCostSummary.css';
import { FixedCostSummaryProps } from '../../../types/fixedCostSummary';

const FixedCostSummary: React.FC<FixedCostSummaryProps> = ({ fixedCosts, categories, totalVariable }) => {
  const totalFixed = fixedCosts.reduce((sum, fc) => sum + fc.amount, 0);
  const grandTotal = totalVariable + totalFixed;

  return (
    <div className="fixed-costs-section">
      <h4>固定費一覧</h4>
      {fixedCosts.length === 0 ? (
        <p>該当する固定費はありません。</p>
      ) : (
        fixedCosts.map(fc => (
          <div key={fc.id} className="fixed-cost-item">
            {fc.description}（{getCategoryName(fc, categories)}）: ¥{fc.amount.toLocaleString()}
          </div>
        ))
      )}
      <div className="fixed-costs-totals">
        固定費合計: ¥{totalFixed.toLocaleString()}<br />
        総合計（変動費 + 固定費）: ¥{grandTotal.toLocaleString()}
      </div>
    </div>
  );
};

export default FixedCostSummary;
