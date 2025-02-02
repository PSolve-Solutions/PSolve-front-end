export interface StaffInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  statusCode: number;
  isSuccess: boolean;
  message: any;
  data: Staff[];
  errors: any;
}
export interface Staff {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  college: number;
  grade: number;
  codeForceHandle: string;
}
export interface OnStaffInfo {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  grade: number;
  birthDate: string;
  college: number;
  gender: number;
  photoUrl: string;
  codeForceHandle: string;
  vjudgeHandle: any;
  userRoles: UserRole[];
}
export interface UserRole {
  role: string;
  campId?: number;
  campName?: string;
}
