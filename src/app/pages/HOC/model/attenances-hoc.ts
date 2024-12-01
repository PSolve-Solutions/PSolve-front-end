export interface Data {
  sessions: SessionAttendance[];
  trainees: AttendanceTrainees;
}

export interface SessionAttendance {
  id: number;
  topic: string;
}

export interface AttendanceTrainees {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  statusCode: number;
  isSuccess: boolean;
  message: any;
  data: Daum[];
  errors: any;
}

export interface Daum {
  traineeId: string;
  name: string;
  status: Status[];
}

export interface Status {
  sessionId: number;
  status?: boolean;
}
