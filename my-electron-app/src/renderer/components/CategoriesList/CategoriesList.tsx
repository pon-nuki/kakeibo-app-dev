import React, { useState } from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './CategoriesList.css';
import Pagination from '../Pagination/PaginationControls';
import { CategoryListProps } from '../../../types/categoriesListTypes';

const ITEMS_PER_PAGE = 10;

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  startEditingCategory,
  handleDeleteCategory,
  editCategoryId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedCategories = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div>
      <List>
        {selectedCategories.map((category) => (
          <ListItem
            key={category.id}
            className={editCategoryId === category.id ? 'editing-item' : ''}
          >
            <ListItemText
              primary={category.name}
            />
            <IconButton onClick={() => startEditingCategory(category)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteCategory(category.id)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CategoryList;
