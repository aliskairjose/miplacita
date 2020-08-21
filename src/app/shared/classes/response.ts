export interface Response {
  message: string;
  success: boolean;
  result: ResponsePaginagion;
}

export interface ResponsePaginagion {
  docs: [];
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
