import { FormArray, FormControl, FormGroup } from '@angular/forms';
export type Form = FormGroup<{
  filtersC: FormArray<FormFilter>;
  filtersV: FormArray<FormFilterV>;
}>;
export type FormFilter = FormGroup<{
  sheetId: FormControl;
  passingPrecent: FormControl;
  communityId: FormControl;
}>;
export type FormFilterV = FormGroup<{
  sheetId: FormControl;
  passingPrecent: FormControl;
  problemCount: FormControl;
}>;
export interface User {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  grade: number;
  college: number;
  gender: number;
  comment: string;
  hasLaptop: boolean;
  codeForceHandle: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  facebookLink: string;
  vjudgeHandle: string;
  birthDate: string;
  acceptAttendType: boolean;
  university: string;
}
export interface AllTraineesInfo {
  currentPage: number;
  data: User[];
  errors: any;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isSuccess: boolean;
  message: any;
  pageSize: number;
  statusCode: number;
  totalCount: number;
  totalPages: number;
}
