import { Metadata } from '../types/metadata';

export function calaculateMetadata(totalRecords: number, page: number, pageSize: number): Metadata {
  return {
    totalRecords: totalRecords,
    pageSize: pageSize,
    currentPage: page,
    firstPage: 1,
    lastPage: totalRecords > 0 ? Math.ceil(totalRecords / pageSize) : 1
  };
}
