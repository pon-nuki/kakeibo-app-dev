export interface ExpenseFormProps {
  description: string;
  amount: string;
  startDate: Date | null;
  editId: number | null;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onDescriptionChange: (description: string) => void;
  onAmountChange: (amount: string) => void;
  onStartDateChange: (date: Date | null) => void;
}