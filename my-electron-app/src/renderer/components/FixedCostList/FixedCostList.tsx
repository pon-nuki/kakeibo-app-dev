import React from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FixedCostListProps } from '../../../types/fixedCostListTypes';
import { FixedCost } from '../../../types/common';
import './FixedCostList.css';

const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case 'bank': return '口座振替';
    case 'credit': return 'クレジットカード';
    case 'cash': return '現金';
    case 'other': return 'その他';
    default: return '不明';
  }
};

const getFrequencyLabel = (frequency: string): string => {
  switch (frequency) {
    case 'monthly': return '毎月';
    case 'yearly': return '毎年';
    case 'quarterly': return '四半期ごと';
    case 'one-time': return '一回のみ';
    default: return '不明';
  }
};

const getCategoryName = (cost: FixedCost, categories: { id: number, name: string }[]): string => {
  if (cost.categoryId) {
    const category = categories.find((cat) => cat.id === cost.categoryId);
    return category ? category.name : '未設定';
  }
  return '未設定';
};

const FixedCostList: React.FC<FixedCostListProps> = ({
  filteredFixedCosts,
  startEditing,
  handleDeleteFixedCost,
  editId,
  categories,
}) => {
  return (
    <div className="expense-list">
      <div className="expense-list-header">
        <div className="col col-description">項目</div>
        <div className="col col-amount">金額</div>
        <div className="col col-start-date">支払日</div>
        <div className="col col-category">カテゴリ</div>
        <div className="col col-method">支払方法</div>
        <div className="col col-frequency">支払頻度</div>
        <div className="col col-next-date">次回支払日</div>
        <div className="col col-actions">操作</div>
      </div>

      {filteredFixedCosts.map((cost) => (
        <div key={cost.id} className={`expense-list-item ${editId === cost.id ? 'editing-item' : ''}`}>
          <div className="col col-description">{cost.description}</div>
          <div className="col col-amount">¥{cost.amount.toLocaleString()}</div>
          <div className="col col-start-date">{cost.date}</div>
          <div className="col col-category">{getCategoryName(cost, categories)}</div>
          <div className="col col-method">{getPaymentMethodLabel(cost.paymentMethod)}</div>
          <div className="col col-frequency">{getFrequencyLabel(cost.frequency)}</div>
          <div className="col col-next-date">{cost.nextPaymentDate || '未設定'}</div>
          <div className="col col-actions">
            <IconButton className="icon-button" title="編集" onClick={() => startEditing(cost)}>
              <EditIcon />
            </IconButton>
            <IconButton className="icon-button" title="削除" onClick={() => handleDeleteFixedCost(cost.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FixedCostList;
