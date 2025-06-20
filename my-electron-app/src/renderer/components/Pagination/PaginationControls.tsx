import React from 'react';
import { Pagination } from '@mui/material';
import { PaginationControlsProps } from '../../../types/paginationControlsTypes';

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  pageCount,
  onPageChange,
}) => {
  if (pageCount <= 1) return null;

  return (
    <Pagination
      count={pageCount}
      page={currentPage}
      onChange={onPageChange}
      color="primary"
      sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
    />
  );
};

export default PaginationControls;
