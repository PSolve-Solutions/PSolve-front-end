export interface Contests {
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
  link: string;
  problemCount: number;
  startTime: string;
  endTime: string;
  chiefOfContest: string;
}
