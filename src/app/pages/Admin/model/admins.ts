export interface Admins {
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
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  photoUrl: any;
}
