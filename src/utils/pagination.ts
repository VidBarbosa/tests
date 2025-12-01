export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function normalizePagination(queryPage?: any, queryLimit?: any): PaginationParams {
  const page = Math.max(1, Number(queryPage) || 1);
  const limit = Math.min(100, Math.max(1, Number(queryLimit) || 10));
  return { page, limit };
}
