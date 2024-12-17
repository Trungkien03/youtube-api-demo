interface DataResponse<T = any> {
  message: string;
  status: number;
  data?: T;
}

interface PaginatedRequestParams {
  page: number;
  pageSize: number;
  where?: Record<string, any>;
  orderBy?: Record<string, 'asc' | 'desc'>;
}
interface PaginateResponse<T = any> {
  data?: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface OrderBy {
  [key: string]: 'asc' | 'desc';
}

interface SearchRequestModel {
  page: number;
  limit: number;
  filterBy?: FilterBy;
  orderBy?: OrderBy;
}

interface FilterCondition {
  equals?: string | number | boolean;
  notEquals?: string | number | boolean;
  in?: (string | number | boolean)[];
  notIn?: (string | number | boolean)[];
  greaterThan?: number;
  lessThan?: number;
  greaterThanOrEqual?: number;
  lessThanOrEqual?: number;
}

interface FilterBy {
  [key: string]: FilterCondition | undefined;
}

export type { DataResponse, PaginateResponse, PaginatedRequestParams, SearchRequestModel };

// Login Response -------------------------------------------
interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}
export type { AuthResponseData };
