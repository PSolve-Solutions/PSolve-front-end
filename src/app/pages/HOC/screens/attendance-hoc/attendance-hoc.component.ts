import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AttendanceHocService } from '../../services/attendance-hoc.service';
import { CasheService } from '../../../../shared/services/cashe.service';
import { RouterLink } from '@angular/router';
import {
  AttendanceTrainees,
  Data,
  SessionAttendance,
} from '../../model/attenances-hoc';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
@Component({
  selector: 'app-attendance-hoc',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './attendance-hoc.component.html',
  styleUrl: './attendance-hoc.component.scss',
})
export class AttendanceHOCComponent implements OnInit {
  attendanceHocService = inject(AttendanceHocService);
  ocSidebarService = inject(OcSidebarService);
  casheService = inject(CasheService);
  allData!: Data;
  allSesions!: SessionAttendance[];
  allTraniees!: AttendanceTrainees;
  currentPage: number = 1;
  pageSize: number = 15;
  isLoading = signal<boolean>(false);
  dataRequest: AttendanceTrainees[] = [];
  hoveredRow: number | null = null;
  hoveredCol: number | null = null;
  ngOnInit() {
    this.getTopics();
  }
  getAllAttendances(currentPage: number, pageSize: number): void {
    this.isLoading.set(true);
    this.attendanceHocService
      .getAllAttendances(currentPage, pageSize)
      .subscribe({
        next: ({ statusCode, data }) => {
          if (statusCode === 200) {
            this.allData = data;
            this.allTraniees = this.allData.trainees;
            this.dataRequest.push(this.allData.trainees);
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
  getTopics(): void {
    this.isLoading.set(true);
    this.attendanceHocService.getTopics().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allSesions = data;
          this.getAllAttendances(this.currentPage, this.pageSize);
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
    if (atBottom && !this.isLoading() && this.allTraniees?.hasNextPage) {
      this.getAllAttendances(++this.currentPage, this.pageSize);
    }
  }
  onHover(rowIndex: number, colIndex: number) {
    this.hoveredRow = rowIndex;
    this.hoveredCol = colIndex;
  }
  onLeave() {
    this.hoveredRow = null;
    this.hoveredCol = null;
  }
}
