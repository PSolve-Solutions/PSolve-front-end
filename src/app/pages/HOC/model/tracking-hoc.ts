export interface MentorsData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  preformance: number;
  traineesCount: number;
  toDoTasksCount: number;
  inProgressTasksCount: number;
  completedTasksCount: number;
  compeletedPractices: number;
  lastPracticeDate: any;
  photoUrl: any;
}
export interface RootMentors {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  statusCode: number;
  isSuccess: boolean;
  message: any;
  data: MentorsData[];
  errors: any;
}
export interface TasksData {
  traineeId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  taskId: number;
  title: string;
  startTime: string;
  endTime: string;
}
export interface Root {
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
  lastName: string;
  middleName: string;
  tracking: Tracking[];
}
export interface Tracking {
  sheetId: number;
  contestId: number;
  solvedCount: number;
}
export interface Names {
  id: number;
  name: string;
  problemCount: number;
}
