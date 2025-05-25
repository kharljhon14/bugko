import { Metadata } from '../types/metadata';

export function calaculateMetadata(totalRecords: number, page: number, pageSize: number): Metadata {
  return {
    totalRecords: totalRecords,
    pageSize: pageSize,
    currentPage: page,
    firstPage: 1,
    lastPage: Math.ceil(totalRecords / pageSize)
  };
}
