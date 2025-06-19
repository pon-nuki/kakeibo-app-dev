import React from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FixedCostListProps } from '../../../types/fixedCostListTypes';
import './FixedCostList.css';
import { getPaymentMethodLabel, getFrequencyLabel, getCategoryName } from '../../../utils/labels';

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
