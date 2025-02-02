export interface Sessions {
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
  topic: string;
  instructorName: string;
  startDate: string;
  endDate: string;
  locationName: string;
  locationLink: string;
}
