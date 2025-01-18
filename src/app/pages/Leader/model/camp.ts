export interface CampInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  statusCode: number;
  isSuccess: boolean;
  message: any;
  data: Camp[];
  errors: any;
}

export interface Camp {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  term: number;
  joinRequestCount: number;
  durationInWeeks: number;
}

export interface AchiverCamp {
  totalProblems: number;
  campName: string;
  achivers: Achiver[];
}

export interface Achiver {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  codeForceHandle: string;
  vjudgeHandle: string;
  solvedProblems: number;
  points: number;
  mentorName: string;
}
