export interface SheetsHoc {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  statusCode: number;
  isSuccess: boolean;
  message: any;
  data: Data[];
  errors: any;
}

export interface Data {
  id: number;
  name: string;
  sheetLink: string;
  status: number;
}
export interface DataMaterial {
  id: number;
  title: string;
  link: string;
  materialOrder: number;
}
