import { FixedCost } from '../../../types/common';

export interface FixedCostListProps {
  filteredFixedCosts: FixedCost[];
  startEditing: (cost: FixedCost) => void;
  handleDeleteFixedCost: (id: number) => void;
  editId: number | null;
  categories: { id: number; name: string }[];
}