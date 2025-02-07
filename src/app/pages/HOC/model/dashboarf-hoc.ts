export interface StandingData {
  campName: string;
  totalProblems: number;
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
export interface DashboardData {
  traineesMalePrecentage: number;
  traineesMaleCount: number;
  mentorsFemaleCount: number;
  mentorsMaleCount: number;
  traineesFemalePrecentage: number;
  traineesFemaleCount: number;
  mentorsMalePrecentage: number;
  mentorsFemalePrecentage: number;
  progressPrecentage: number;
  completedDaysPrecentage: number;
  remainDays: number;
  totalDays: number;
  sheetsAnalysis: SheetsAnalysi[];
  contestsAnalysis: ContestsAnalysi[];
  colleges: College[];
}
export interface SheetsAnalysi {
  name: string;
  precentage: number;
}
export interface ContestsAnalysi {
  name: string;
  precentage: number;
}
export interface College {
  name: string;
  count: number;
}
