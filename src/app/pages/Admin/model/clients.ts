export interface Clinets {
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
  clientName: string;
  gmail: string;
  endDate: string;
  isLocked: boolean;
  logoUrl: string;
}
export interface OneClient {
  id: string;
  clientName: string;
  gmail: string;
  logoUrl: string;
  facebookLink: any;
  isLocked: boolean;
  startDate: string;
  endDate: string;
  leaders: Leaders[];
}
interface Leaders {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
}
