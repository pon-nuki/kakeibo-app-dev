import React from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FixedCostListProps } from '../../../types/fixedCostListTypes';
import './FixedCostList.css';
import { getPaymentMethodLabel, getFrequencyLabel, getCategoryName } from '../../../utils/labels';
import { useTranslation } from 'react-i18next';

const FixedCostList: React.FC<FixedCostListProps> = ({
  filteredFixedCosts,
  startEditing,
  handleDeleteFixedCost,
  editId,
  categories,
}) => {
  const { t } = useTranslation();

  return (
    <div className="expense-list">
      <div className="expense-list-header">
        <div className="col col-description">{t('fixedCostList.description')}</div>
        <div className="col col-amount">{t('fixedCostList.amount')}</div>
        <div className="col col-start-date">{t('fixedCostList.date')}</div>
        <div className="col col-category">{t('fixedCostList.category')}</div>
        <div className="col col-method">{t('fixedCostList.paymentMethod')}</div>
        <div className="col col-frequency">{t('fixedCostList.frequency')}</div>
        <div className="col col-next-date">{t('fixedCostList.nextPayment')}</div>
        <div className="col col-actions">{t('fixedCostList.actions')}</div>
      </div>

      {filteredFixedCosts.map((cost) => (
        <div key={cost.id} className={`expense-list-item ${editId === cost.id ? 'editing-item' : ''}`}>
          <div className="col col-description">{cost.description}</div>
          <div className="col col-amount">¥{cost.amount.toLocaleString()}</div>
          <div className="col col-start-date">{cost.date}</div>
          <div className="col col-category">{getCategoryName(cost, categories)}</div>
          <div className="col col-method">{getPaymentMethodLabel(cost.paymentMethod)}</div>
          <div className="col col-frequency">{getFrequencyLabel(cost.frequency)}</div>
          <div className="col col-next-date">{cost.nextPaymentDate || t('fixedCostList.notSet')}</div>
          <div className="col col-actions">
          <IconButton
            className="icon-button icon-edit"
            title={t('fixedCostList.edit')}
            onClick={() => startEditing(cost)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            className="icon-button icon-delete"
            title={t('fixedCostList.delete')}
            onClick={() => handleDeleteFixedCost(cost.id)}
          >
            <DeleteIcon />
          </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FixedCostList;
