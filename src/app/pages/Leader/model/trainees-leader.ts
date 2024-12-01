export interface TraineeInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  statusCode: number;
  isSuccess: boolean;
  message: any;
  data: Trainee[];
  errors: any;
}

export interface Trainee {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  codeForceHandle: string;
}

export interface OnTraineeInfo {
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
