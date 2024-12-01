export interface traineesAnalysis {
  traineesCount: number;
  malesCount: number;
  femalesCount: number;
  collegesAnalisis: CollegesAnalisi[];
}

export interface CollegesAnalisi {
  name: string;
  count: number;
}

export interface dashboardFeedbacks {
  rate: number;
  feedback: string;
  photoUrl: any;
  fullName: string;
  middleName: string;
  firstName: string;
}
