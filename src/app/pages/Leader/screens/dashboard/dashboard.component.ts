import { DatePipe, NgClass } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ChartDashboardComponent } from '../../Components/chart-dashboard/chart-dashboard.component';
import { DashboardService } from '../../services/dashboard.service';
import { dashboardFeedbacks, traineesAnalysis } from '../../model/dashboard';
import { TestimonialComponent } from '../../Components/testimonial/testimonial.component';
import { RouterLink } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    TestimonialComponent,
    ChartDashboardComponent,
    NgClass,
    RouterLink,
    ToastrModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardService);
  toastr = inject(ToastrService);
  isLoading = signal<boolean>(false);
  traineesCount: number = 0;
  malesCount: number = 0;
  femalesCount: number = 0;
  collegesAnalisis: { name: string; count: number }[] = [];
  dashboardCamps: {
    id: number;
    name: string;
    dueDate: string;
    progress: number;
  }[] = [];
  dashboardFeedbacks: dashboardFeedbacks[] = [];

  ngOnInit() {
    this.fetchTraineesAnalysis();
    // this.fetchDashboardCamps();
    // this.fetchDashboardFeedbacks();
  }

  fetchTraineesAnalysis(): void {
    this.isLoading.set(true);
    this.dashboardService.traineesAnalysis().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          const traineesAnalysisInfo = data as traineesAnalysis;
          this.traineesCount = traineesAnalysisInfo.traineesCount;
          this.malesCount = traineesAnalysisInfo.malesCount;
          this.femalesCount = traineesAnalysisInfo.femalesCount;
          this.collegesAnalisis = traineesAnalysisInfo.collegesAnalisis;
          this.fetchDashboardCamps();
          this.isLoading.update((v) => (v = false));
        } else {
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading.update((v) => (v = false));
      },
    });
  }

  fetchDashboardCamps(): void {
    this.isLoading.set(true);
    this.dashboardService.dashboardCamps().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.dashboardCamps = data;
          this.fetchDashboardFeedbacks();
          this.isLoading.update((v) => (v = false));
        } else {
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading.update((v) => (v = false));
      },
    });
  }

  fetchDashboardFeedbacks(): void {
    this.dashboardService.dashboardFeedbacks().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.dashboardFeedbacks = data;
        } else {
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
