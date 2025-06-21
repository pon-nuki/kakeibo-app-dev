import React from 'react';
import './CurrencyAmount.css';

type CurrencyAmountProps = {
  amount: number;
  currencyCode: 'JPY' | 'USD' | 'RUB';
};

const currencySymbols: Record<string, string> = {
  JPY: '¥',
  USD: '$',
  RUB: '₽',
};

const currencyPositionMap: Record<string, 'prefix' | 'suffix'> = {
  JPY: 'prefix',
  USD: 'prefix',
  RUB: 'suffix',
};

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const CurrencyAmount: React.FC<CurrencyAmountProps> = ({ amount, currencyCode }) => {
  const symbol = currencySymbols[currencyCode] || '';
  const position = currencyPositionMap[currencyCode] || 'prefix';

  return (
    <div className="amount-with-currency">
      {position === 'prefix' && <sub className="currency-symbol">{symbol}</sub>}
      <span className="amount">{formatAmount(amount)}</span>
      {position === 'suffix' && <sub className="currency-symbol">{symbol}</sub>}
    </div>
  );
};

export default CurrencyAmount;
