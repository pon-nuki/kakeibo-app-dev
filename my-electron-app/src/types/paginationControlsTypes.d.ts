export interface PaginationControlsProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}