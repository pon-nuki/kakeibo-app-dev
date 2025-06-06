export interface FixedCostFormProps {
  description: string;
  amount: string;
  startDate: Date | null;
  paymentMethod: string;
  categories: { id: number; name: string }[];
  selectedCategory: number | null;
  editId: number | null;
  onDescriptionChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onStartDateChange: (value: Date | null) => void;
  onPaymentMethodChange: (value: string) => void;
  onCategoryChange: (value: number | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
}