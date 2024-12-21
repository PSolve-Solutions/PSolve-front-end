import { Routes } from '@angular/router';
import { authGuard, authGuardLoggdIn } from './authentication/guard/auth.guard';
import { rolesGuard } from './authentication/guard/roles.guard';
import { DashboardComponent } from './pages/Leader/screens/dashboard/dashboard.component';
import { LayoutTraineeComponent } from './layouts/layout_trainee/layout-trainee.component';
import { HomeTraineeComponent } from './pages/Trainee/screens/home-trainee/home-trainee.component';

import { AddUserComponent } from './pages/Leader/screens/add-user/add-user.component';

import { MentorLayoutComponent } from './layouts/mentor/mentor-layout/mentor-layout.component';
import { TraineesComponent } from './pages/mentor/trainees/trainees.component';
import { AttendanceComponent } from './pages/mentor/attendance/attendance.component';
import { StandingsComponent } from './pages/mentor/standings/standings.component';
import { TrackingComponent } from './pages/mentor/tracking/tracking.component';
import { TasksComponent } from './pages/mentor/tasks/tasks.component';
import { PracticeComponent } from './pages/mentor/practice/practice.component';

import { CampsLeaderComponent } from './pages/Leader/screens/camps-leader/camps-leader.component';
import { ActiosCampComponent } from './pages/Leader/screens/actios-camp/actios-camp.component';
import { StandingCampComponent } from './pages/Leader/screens/standing-camp/standing-camp.component';
import { StaffLeaderComponent } from './pages/Leader/screens/staff-leader/staff-leader.component';
import { TraineesLeaderComponent } from './pages/Leader/screens/trainees-leader/trainees-leader.component';
import { ArchiveLeaderComponent } from './pages/Leader/screens/archive-leader/archive-leader.component';
import { SheetsTraineeComponent } from './pages/Trainee/screens/sheets-trainee/sheets-trainee.component';
import { ContestTraineeComponent } from './pages/Trainee/screens/contest-trainee/contest-trainee.component';

import { ReportsLeaderComponent } from './pages/Leader/screens/reports-leader/reports-leader.component';
import { RequestsLeaderComponent } from './pages/Leader/screens/requests-leader/requests-leader.component';

import { StandingTraineeComponent } from './pages/Trainee/screens/standing-trainee/standing-trainee.component';

import { ContestsHOCComponent } from './pages/HOC/screens/contests-hoc/contests-hoc.component';
import { SessionsHOCComponent } from './pages/HOC/screens/sessions-hoc/sessions-hoc.component';
import { ActionsContestsComponent } from './pages/HOC/screens/actions-contests/actions-contests.component';
import { ActionsSessionsComponent } from './pages/HOC/screens/actions-sessions/actions-sessions.component';
import { DashoardHOCComponent } from './pages/HOC/screens/dashoard-hoc/dashoard-hoc.component';
import { AssignHOCComponent } from './pages/HOC/screens/assign-hoc/assign-hoc.component';
import { SheetsHOCComponent } from './pages/HOC/screens/sheets-hoc/sheets-hoc.component';
import { ActionsSheetsComponent } from './pages/HOC/screens/actions-sheets/actions-sheets.component';
import { EditAttendanceComponent } from './pages/HOC/screens/edit-attendance/edit-attendance.component';
import { WeeklyFilterHOCComponent } from './pages/HOC/screens/weekly-filter-hoc/weekly-filter-hoc.component';
import { AttendanceHOCComponent } from './pages/HOC/screens/attendance-hoc/attendance-hoc.component';

import { OtpComponent } from './authentication/screens/login/otp/otp.component';
import { SetpassComponent } from './authentication/screens/login/setpass/setpass.component';
import { ForgetComponent } from './authentication/screens/login/forget/forget.component';
import { LogComponent } from './authentication/screens/login/log/log.component';
import { LayoutPublicComponent } from './layouts/layout_public/layout-public.component';
import { HomePublicComponent } from './pages/public/screens/home-public/home-public.component';
import { BlankComponent } from './pages/mentor/blank/blank.component';
import { CampsPublicComponent } from './pages/public/screens/camps-public/camps-public.component';

import { LayoutProfileComponent } from './layouts/layout_profile/layout-profile/layout-profile.component';
import { ProfileDetailsComponent } from './pages/leader_profile/screens/profile-details/profile-details.component';
import { LeaderSettingsComponent } from './pages/leader_profile/screens/leader-settings/leader-settings.component';
import { ProfileTraineeComponent } from './pages/trainee-profile/screens/profile-trainee/profile-trainee.component';
import { MentorsTrackingComponent } from './pages/HOC/screens/mentors-tracking/mentors-tracking.component';
import { TraineeTrackingComponent } from './pages/HOC/screens/trainee-tracking/trainee-tracking.component';
import { AdminHomeComponent } from './pages/Admin/screens/admin-home/admin-home.component';
import { AdminClientsComponent } from './pages/Admin/screens/admin-clients/admin-clients.component';
import { UpsertAdminComponent } from './pages/Admin/screens/upsert-admin/upsert-admin.component';
import { ClientDetailsComponent } from './pages/Admin/screens/client-details/client-details.component';
import { AddClientComponent } from './pages/Admin/screens/add-client/add-client.component';
import { RegistrationTraineeComponent } from './authentication/screens/registration-trainee/registration-trainee.component';
import { CommunityLeaderComponent } from './pages/Leader/screens/community-leader/community-leader.component';
import { UniversityAdminComponent } from './pages/Admin/screens/university-admin/university-admin.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  // Trainee Pages
  {
    path: 'trainee',
    title: 'ICPC',
    canActivate: [rolesGuard],
    component: LayoutTraineeComponent,

    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeTraineeComponent,
        title: 'Trainee / Home - ICPC',
      },
      {
        path: 'sheets',
        component: SheetsTraineeComponent,
        title: 'Trainee / Sheets - ICPC',
      },
      {
        path: 'contests',
        component: ContestTraineeComponent,
        title: 'Trainee / contests - ICPC',
      },
      {
        path: 'standing',
        component: StandingTraineeComponent,
        title: 'Trainee / standing - ICPC',
      },
    ],
  },

  // Main Home Page
  {
    path: '',
    title: 'ICPC',
    component: LayoutPublicComponent,
    // canActivate: [rolesGuard],
    children: [
      {
        path: '',
        component: HomePublicComponent,
        title: 'Home - ICPC',
      },
      {
        path: 'camps',
        component: CampsPublicComponent,
        title: 'Camps - ICPC',
      },
    ],
  },

  {
    path: 'registration',
    // component: FormsCampsPublicComponent,
    component: RegistrationTraineeComponent,
    title: 'Apply Now - PSolve',
  },

  // Admin Routes
  {
    path: 'psovle',
    component: MainLayoutComponent,
    canActivate: [authGuard, rolesGuard],
    title: 'PSolve',
    children: [
      {
        path: '',
        component: AdminHomeComponent,
        title: 'Admins - PSolve',
      },
      {
        path: 'upsert-admin/:id',
        component: UpsertAdminComponent,
        title: 'Admins / Add Admin - PSolve',
      },
      {
        path: 'clients',
        component: AdminClientsComponent,
        title: 'Clients - PSolve',
      },
      {
        path: 'clients',
        children: [
          {
            path: 'add-client',
            component: AddClientComponent,
            title: 'Clients / Add Client - PSolve',
          },
          {
            path: 'client-details/:id',
            component: ClientDetailsComponent,
            title: 'Clients / Client Details - PSolve',
          },
        ],
      },
      {
        path: 'university',
        component: UniversityAdminComponent,
        title: 'University - PSolve',
      },
    ],
  },

  // Leader Routes
  {
    path: 'leader',
    component: MainLayoutComponent,
    canActivate: [authGuard, rolesGuard],
    title: 'Leader - ICPC',
    children: [
      {
        path: '',
        component: DashboardComponent,
        title: 'Leader / Dashboard - ICPC',
      },
      {
        path: 'add-user',
        component: AddUserComponent,
        title: 'Leader / add new user - ICPC',
      },
      {
        path: 'camps',
        component: CampsLeaderComponent,
        title: 'Leader / Camps - ICPC',
      },
      {
        path: 'camps',
        children: [
          {
            path: 'action-camp/:id',
            component: ActiosCampComponent,
            title: 'Leader / Camps / action-camp - ICPC',
          },
        ],
      },
      {
        path: 'camps',
        children: [
          {
            path: 'standing/:id',
            component: StandingCampComponent,
            title: 'Leader / Camps / standing - ICPC',
          },
        ],
      },
      {
        path: 'staff',
        component: StaffLeaderComponent,
        title: 'Leader / staff - ICPC',
      },
      {
        path: 'trainees',
        component: TraineesLeaderComponent,
        title: 'Leader / Trainees - ICPC',
      },

      {
        path: 'reports',
        component: ReportsLeaderComponent,
        title: 'Leader / reports - ICPC',
      },
      {
        path: 'requests',
        component: RequestsLeaderComponent,
        title: 'Leader / requests - ICPC',
      },
      {
        path: 'archive',
        component: ArchiveLeaderComponent,
        title: 'Leader / Archive - ICPC',
      },
      {
        path: 'community',
        component: CommunityLeaderComponent,
        title: 'Leader / community - ICPC',
      },
    ],
  },

  // HOC Pages
  {
    path: 'head_of_camp',
    component: MainLayoutComponent,
    canActivate: [authGuard, rolesGuard],
    title: 'HOC - Dashboard',
    children: [
      {
        path: '',
        component: DashoardHOCComponent,
        title: 'head of camp - Dashboard',
      },
      {
        path: 'assign',
        component: AssignHOCComponent,
        title: 'head of camp - Assign',
      },
      {
        path: 'contests',
        component: ContestsHOCComponent,
        title: 'head of camp - Contests',
      },
      {
        path: 'contests',
        children: [
          {
            path: 'action-contest/:id',
            component: ActionsContestsComponent,
            title: 'head of camp / Contests / action-contest- ICPC',
          },
        ],
      },
      {
        path: 'sessions',
        component: SessionsHOCComponent,
        title: 'head of camp - Sessions',
      },
      {
        path: 'sessions',
        children: [
          {
            path: 'action-session/:id',
            component: ActionsSessionsComponent,
            title: 'head of camp / Sessions / action-contest- ICPC',
          },
        ],
      },
      {
        path: 'sheets',
        component: SheetsHOCComponent,
        title: 'head of camp - Sheets',
      },
      {
        path: 'sheets',
        children: [
          {
            path: 'action-sheets/:id',
            component: ActionsSheetsComponent,
            title: 'head of camp / Sheets / action-sheets- ICPC',
          },
        ],
      },
      {
        path: 'attendance',
        component: AttendanceHOCComponent,
        title: 'head of camp - Attendance',
      },
      {
        path: 'attendance',
        children: [
          {
            path: 'edit-attendance',
            component: EditAttendanceComponent,
            title: 'head of camp / Attendance / edit-attendance- ICPC',
          },
        ],
      },
      {
        path: 'Weekly-filter',
        component: WeeklyFilterHOCComponent,
        title: 'head of camp - Weekly Filter',
      },
      {
        path: 'mentors-tracking',
        component: MentorsTrackingComponent,
        title: 'head of camp - Mentors Tracking',
      },
      {
        path: 'trainee-tracking',
        component: TraineeTrackingComponent,
        title: 'head of camp - Trainees Tracking',
      },
    ],
  },

  // mentor Pages
  {
    path: 'mentor',
    component: MentorLayoutComponent,
    canActivate: [authGuard, rolesGuard],
    title: 'Mentor',
    children: [
      {
        path: '',
        component: TraineesComponent,
        title: 'mentor / Trainees - ICPC',
      },
      {
        path: 'attendance',
        component: AttendanceComponent,
        title: 'mentor / Attendance - ICPC',
      },
      {
        path: 'standings',
        component: StandingsComponent,
        title: 'mentor / Standings - ICPC',
      },
      {
        path: 'tracking',
        component: TrackingComponent,
        title: 'mentor / Tracking - ICPC',
      },
      {
        path: 'tasks',
        component: TasksComponent,
        title: 'mentor / Tasks - ICPC',
      },
      {
        path: 'practice',
        component: PracticeComponent,
        title: 'mentor / Practice - ICPC',
      },

      {
        path: 'blank',
        component: BlankComponent,
        title: 'mentor / Practice - ICPC',
      },
    ],
  },

  // Login Page
  {
    path: 'login',
    component: LoginLayoutComponent,
    canActivate: [authGuardLoggdIn],
    title: 'PSovle - Login',
    children: [
      {
        path: '',
        component: LogComponent,
        title: 'PSovle - Login',
      },
      {
        path: 'forget',
        component: ForgetComponent,
        title: 'PSovle - Forget Password',
      },
      {
        path: 'set/:token/:email',
        component: SetpassComponent,
        title: 'PSovle - Reset Password',
      },
      {
        path: 'otp/:email',
        component: OtpComponent,
        title: 'PSovle - OTP',
      },
    ],
  },

  // Profile Pages
  //leader and HOC
  {
    path: 'profile',
    component: LayoutProfileComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'leader',
        component: ProfileDetailsComponent,
        title: 'ICPC - Leader / Profile',
      },
      {
        path: 'leader/settings',
        component: LeaderSettingsComponent,
        title: 'ICPC - Leader / Account',
      },
      //head_of_camp
      {
        path: 'head_of_camp',
        component: ProfileDetailsComponent,
        title: 'ICPC - Head Of Camp / Profile',
      },
      {
        path: 'head_of_camp/settings',
        component: LeaderSettingsComponent,

        title: 'ICPC - Head Of Camp / Account',
      },
      //trainee
      {
        path: 'trainee',
        component: ProfileTraineeComponent,
        title: 'ICPC - Trainee / Profile',
      },
      {
        path: 'trainee/account',
        component: LeaderSettingsComponent,
        title: 'ICPC - Trainee / Account',
      },
      //trainee
      {
        path: 'mentor',
        component: ProfileDetailsComponent,
        title: 'ICPC - Mentor / Profile',
      },
      {
        path: 'mentor/account',
        component: LeaderSettingsComponent,
        title: 'ICPC - Mentor / Account',
      },
    ],
  },
];
