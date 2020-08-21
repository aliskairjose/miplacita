export interface Response<T> {
  message: string;
  success: boolean;
  result: ResponsePaginagion<T>;
}

export interface ResponsePaginagion<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number;
  nextPage: number;
}

