interface DataResponse<T = any> {
  message: string
  status: number
  data?: T
}

interface PaginatedRequestParams {
  page: number
  pageSize: number
  where?: Record<string, any>
  orderBy?: Record<string, 'asc' | 'desc'>
}
interface PaginateResponse<T = any> {
  data?: T
  total: number
  page: number
  limit: number
  totalPages: number
}

interface User {
  id: string
  name: string
  email: string
  image: string
}

export type { DataResponse, PaginatedRequestParams, PaginateResponse, User }
