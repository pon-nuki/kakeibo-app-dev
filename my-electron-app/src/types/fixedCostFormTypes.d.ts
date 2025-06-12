export interface FixedCostFormProps {
  description: string;
  amount: string;
  startDate: Date | null;
  nextPaymentDate: Date | null; // 次回支払日を追加
  paymentMethod: string;
  frequency: 'monthly' | 'quarterly' | 'annually' | 'other'; // 支払頻度を追加
  categories: { id: number; name: string }[];
  selectedCategory: number | null;
  editId: number | null;
  onDescriptionChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onStartDateChange: (value: Date | null) => void;
  onNextPaymentDateChange: (value: Date | null) => void; // 次回支払日の変更用
  onPaymentMethodChange: (value: string) => void;
  onCategoryChange: (value: number | null) => void;
  onFrequencyChange: (value: 'monthly' | 'quarterly' | 'annually' | 'other') => void; // 支払頻度変更用
  onSubmit: () => void;
  onCancel: () => void;
}
