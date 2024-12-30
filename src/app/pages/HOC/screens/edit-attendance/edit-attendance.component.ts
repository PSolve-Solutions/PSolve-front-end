import { Component, inject, OnInit, signal } from '@angular/core';
import { AttendanceHocService } from '../../services/attendance-hoc.service';
import { CasheService } from '../../../../shared/services/cashe.service';
import { NgClass } from '@angular/common';
import {
  AttendanceTrainees,
  SessionAttendance,
} from '../../model/attenances-hoc';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-edit-attendance',
  standalone: true,
  imports: [NgClass],
  templateUrl: './edit-attendance.component.html',
  styleUrl: './edit-attendance.component.scss',
})
export class EditAttendanceComponent implements OnInit {
  attendanceHocService = inject(AttendanceHocService);
  ocSidebarService = inject(OcSidebarService);
  casheService = inject(CasheService);
  allSesions!: SessionAttendance[];
  allTraniees!: any;
  sessionId: number = 0;
  isLoading = signal<boolean>(false);
  activeTab: number | null = null;
  ngOnInit() {
    this.getTopics();
  }

  getAttendanceBySessionId(sessionId: number): void {
    this.isLoading.set(true);
    this.attendanceHocService.getAttendanceBySessionId(sessionId).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allTraniees = data;
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
          this.sessionId = this.allSesions[0].id;
          this.getAttendanceBySessionId(this.sessionId);
          this.activeTab = this.sessionId;
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

  onTabClick(sessionId: number): void {
    this.activeTab = sessionId;
    this.sessionId = sessionId;
    this.getAttendanceBySessionId(sessionId);
  }

  toggleStatus(traineeId: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newStatus = inputElement.checked;
    const traineeIndex = this.allTraniees.findIndex(
      (trainee: any) => trainee.id === traineeId
    );
    if (traineeIndex !== -1) {
      this.allTraniees[traineeIndex].isAttend = newStatus;
    }
    const info = {
      traineeId: traineeId,
      sessionId: this.sessionId,
    };
    this.updateAatendance(info);
    this.casheService.clearCache;
  }

  updateAatendance(info: any): void {
    this.attendanceHocService.updateAatendance(info).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          // this.isLoadingMaterial.update((v) => (v = false));
        } else {
          // this.isLoadingMaterial.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
