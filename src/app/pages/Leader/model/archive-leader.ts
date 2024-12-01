export interface TraineeArchiveInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  statusCode: number;
  isSuccess: boolean;
  message: any;
  data: TraineeArchive[];
  errors: any;
}

export interface TraineeArchive {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  codeForceHandle: string;
  gender: number;
  campName: string;
  college: string;
}

export interface OnArchiveUserInfo {
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
  campName: string;
  facebookHandle: string;
  isComplete: boolean;
  role: string;
  vjudgeHandle: any;
}
