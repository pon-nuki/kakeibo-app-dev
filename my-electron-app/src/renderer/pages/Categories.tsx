import React, { useState, useEffect } from 'react';
import { IconButton, Box, Typography, TextField, Button } from '@mui/material';
import './Categories.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import Filter from '../components/CategoriesFilter/CategoriesFilter';
import CategoryList from '../components/CategoriesList/CategoriesList';
import { Category } from '../../types/common';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../services/categoriesService';
import { useTranslation } from 'react-i18next';

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAndSetCategories();
  }, []);

  const fetchAndSetCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      setErrorMessage(t('categories.fetchError'));
    }
  };

  const handleAddCategory = async () => {
    if (categoryName) {
      try {
        await addCategory(categoryName);
        await fetchAndSetCategories();
        setCategoryName('');
        setErrorMessage('');
      } catch (err) {
        setErrorMessage(t('categories.addError'));
      }
    } else {
      setErrorMessage(t('categories.nameRequired'));
    }
  };

  const handleUpdateCategory = async () => {
    if (editCategoryId !== null && categoryName) {
      try {
        await updateCategory(editCategoryId, categoryName);
        await fetchAndSetCategories();
        setEditCategoryId(null);
        setCategoryName('');
        setErrorMessage('');
      } catch (err) {
        setErrorMessage(t('categories.updateError'));
      }
    } else {
      setErrorMessage(t('categories.noEditTarget'));
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      await fetchAndSetCategories();
    } catch (error) {
      setErrorMessage(t('categories.deleteError'));
    }
  };

  const startEditingCategory = (category: Category) => {
    setEditCategoryId(category.id);
    setCategoryName(category.name);
  };

  const cancelEdit = () => {
    setEditCategoryId(null);
    setCategoryName('');
  };

  return (
    <div className="home-container">
      <Box className="header-wrapper">
        <Box className="title-icon-row">
          <Typography variant="h5" className="header-title">{t('categories.title')}</Typography>
          <IconButton className="filter-icon-button">
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <Box className="category-form">
        <TextField
          label={t('categories.inputLabel')}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={editCategoryId === null ? handleAddCategory : handleUpdateCategory}
        >
          {editCategoryId === null ? t('categories.add') : t('categories.update')}
        </Button>
        {editCategoryId && (
          <Button variant="outlined" onClick={cancelEdit}>{t('categories.cancel')}</Button>
        )}
      </Box>

      <hr />

      <CategoryList
        categories={categories}
        startEditingCategory={startEditingCategory}
        handleDeleteCategory={handleDeleteCategory}
        editCategoryId={editCategoryId}
      />

      <h3>{t('categories.total')}: {categories.length}</h3>
    </div>
  );
};

export default Categories;
