import React, { useState, useEffect } from 'react';
import { IconButton, Box, Typography, TextField, Button } from '@mui/material';
import './Categories.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import Filter from '../components/CategoriesFilter/CategoriesFilter';
import CategoryList from '../components/CategoriesList/CategoriesList';
import { Category}  from '../../types/common'
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../services/categoriesService';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // フィルター用
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
  const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
  const [searchType, setSearchType] = useState<'exact' | 'range'>('exact'); // 検索タイプ

  // データを取得する
  const fetchAndSetCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      setErrorMessage('カテゴリの取得に失敗しました。');
    }
  };

  useEffect(() => {
    fetchAndSetCategories();
  }, []);

  // カテゴリを追加
  const handleAddCategory = async () => {
    if (categoryName) {
      try {
        await addCategory(categoryName);
        await fetchAndSetCategories();
        setCategoryName('');
        setErrorMessage('');
      } catch (err) {
        setErrorMessage('カテゴリの追加に失敗しました');
      }
    } else {
      setErrorMessage('カテゴリ名は必須です。');
    }
  };

  // カテゴリを更新
  const handleUpdateCategory = async () => {
    if (editCategoryId !== null && categoryName) {
      try {
        await updateCategory(editCategoryId, categoryName);
        await fetchAndSetCategories();
        setEditCategoryId(null);
        setCategoryName('');
        setErrorMessage('');
      } catch (err) {
        setErrorMessage('カテゴリの更新に失敗しました。');
      }
    } else {
      setErrorMessage('編集するカテゴリが選ばれていません。');
    }
  };

  // カテゴリを削除
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      await fetchAndSetCategories();
    } catch (error) {
      setErrorMessage('カテゴリの削除に失敗しました。');
    }
  };

  // カテゴリの編集開始
  const startEditingCategory = (category: Category) => {
    setEditCategoryId(category.id);
    setCategoryName(category.name);
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditCategoryId(null);
    setCategoryName('');
  };

  // 合計金額の計算（フィルターに合わせた表示）
  const totalFilteredAmount = categories.reduce(
    (total, category) => total + category.id, // カテゴリには金額はないので仮でIDで合計
    0
  );

  return (
    <div className="home-container">
      <Box className="header-wrapper">
        <Box className="title-icon-row">
          <Typography variant="h5" className="header-title">カテゴリ設定</Typography>
          <IconButton className="filter-icon-button">
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* カテゴリフォーム */}
      <Box className="category-form">
        <TextField
          label="カテゴリ名"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={editCategoryId === null ? handleAddCategory : handleUpdateCategory}
        >
          {editCategoryId === null ? '追加' : '更新'}
        </Button>
        {editCategoryId && (
          <Button variant="outlined" onClick={cancelEdit}>キャンセル</Button>
        )}
      </Box>

      <hr />

      {/* カテゴリリスト */}
      <CategoryList
        categories={categories}
        startEditingCategory={startEditingCategory}
        handleDeleteCategory={handleDeleteCategory}
        editCategoryId={editCategoryId}
      />

      <h3>合計カテゴリ数: {categories.length}</h3>
    </div>
  );
};

export default Categories;
