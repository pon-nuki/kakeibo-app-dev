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
      <List className="category-list">
        {selectedCategories.map((category) => (
          <ListItem
            key={category.id}
            className={`category-list-item ${editCategoryId === category.id ? 'editing-item' : ''}`}
          >
            <div className="category-name">{category.name}</div>
            <div className="col-actions">
              <IconButton
                className="icon-button"
                title="編集"
                onClick={() => startEditingCategory(category)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                className="icon-button"
                title="削除"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
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
