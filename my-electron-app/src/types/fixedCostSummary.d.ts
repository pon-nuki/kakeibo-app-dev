import { FixedCost } from './common';

type CurrencyCode = 'JPY' | 'USD' | 'RUB';

interface FixedCostSummaryProps {
  fixedCosts: FixedCost[];
  categories: { id: number; name: string }[];
  totalVariable: number;
  currency: CurrencyCode;
}