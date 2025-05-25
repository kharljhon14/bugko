export interface Metadata {
  currentPage: number;
  pageSize: number;
  firstPage: number;
  lastPage: number;
  totalRecords: number;
}

export interface GenericResponseArray<T> {
  data: T[];
  _metadata: Metadata;
}

export interface GenericResponse<T> {
  data: T;
}
