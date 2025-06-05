export interface FixedCostFormProps {
  description: string;
  amount: string;
  startDate: Date | null;
  paymentMethod: string;
  editId: number | null;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onDescriptionChange: (description: string) => void;
  onAmountChange: (amount: string) => void;
  onStartDateChange: (date: Date | null) => void;
  onPaymentMethodChange: (method: string) => void;
}