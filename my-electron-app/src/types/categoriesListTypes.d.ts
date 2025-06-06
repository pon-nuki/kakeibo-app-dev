export interface CategoryListProps {
  categories: Category[];
  startEditingCategory: (category: Category) => void;
  handleDeleteCategory: (id: number) => void;
  editCategoryId: number | null;
}
