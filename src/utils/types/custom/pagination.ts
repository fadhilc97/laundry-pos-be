export type PaginationQuery = {
  limit?: string;
  page?: string;
};

export type PaginationMeta = {
  prevPage: number | null;
  currentPage: number;
  nextPage: number | null;
  lastPage: number;
  limit: number;
  totalRows: number;
};
