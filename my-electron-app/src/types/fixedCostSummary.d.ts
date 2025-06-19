import { FixedCost } from './common';

interface FixedCostSummaryProps {
  fixedCosts: FixedCost[];
  categories: { id: number; name: string }[];
  totalVariable: number;
}