import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TrackingService } from '../../services/tracking.service';
import { MentorsData, RootMentors, TasksData } from '../../model/tracking-hoc';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
@Component({
  selector: 'app-mentors-tracking',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './mentors-tracking.component.html',
  styleUrl: './mentors-tracking.component.scss',
})
export class MentorsTrackingComponent implements OnInit {
  trackingService = inject(TrackingService);
  ocSidebarService = inject(OcSidebarService);
  isLoading = signal<boolean>(false);
  allMentorsData!: RootMentors;
  dataRequest: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  taskId: number = 0 | 1 | 2;
  mentorId: string | null = null;
  id: string | null = null;
  bars = Array(5).fill(0);
  allTasksData: TasksData[] = [];
  isShowLable: boolean = false;
  ngOnInit() {
    this.getAllMentors(this.currentPage, this.pageSize);
  }
  filledBars(progress: number): number {
    return Math.round((progress / 100) * this.bars.length);
  }
  getAllMentors(currentPage: number, pageSize: number): void {
    this.isLoading.set(true);
    this.trackingService
      .trackingWithPaingation(currentPage, pageSize)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allMentorsData = res;
            this.dataRequest.push(this.allMentorsData);
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
  loadMoreData(event: any): void {
    const element = event.target;
    const bottomThreshold = 5;
    const atBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - bottomThreshold;
    if (atBottom && !this.isLoading() && this.allMentorsData?.hasNextPage) {
      this.getAllMentors(++this.currentPage, this.pageSize);
    }
  }
  getMentorId(mentorId: string): void {
    if (this.mentorId === mentorId) {
      this.mentorId = null;
    } else {
      this.mentorId = mentorId;
      this.taskId = 0;
      this.getTasksByTaskStatus(mentorId, this.taskId);
    }
  }
  getTasksByTaskStatus(mentorId: string, taskStatus: number): void {
    // this.isLoading.set(true);
    this.trackingService.getTasksByTaskStatus(mentorId, taskStatus).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allTasksData = data;
          console.log(this.allTasksData);
          // this.isLoading.update((v) => (v = false));
        } else {
          // this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        // this.isLoading.update((v) => (v = false));
      },
    });
  }
  changeTaskTitle(item: number): void {
    this.taskId = item;
    if (this.mentorId !== null) {
      this.getTasksByTaskStatus(this.mentorId, this.taskId);
    }
  }
  showLable(id: string): void {
    this.id = id;
  }
  hideLable(): void {
    this.id = null;
  }
}
