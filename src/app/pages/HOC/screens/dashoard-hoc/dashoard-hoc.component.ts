import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardHocService } from '../../services/dashboard-hoc.service';
import { NgClass } from '@angular/common';
import { DashboardData, StandingData } from '../../model/dashboarf-hoc';
import { DashboardChartsHocComponent } from '../../components/dashboard-charts-hoc/dashboard-charts-hoc.component';
import { ExportExcelService } from '../../../../shared/services/export-excel.service';
@Component({
  selector: 'app-dashoard-hoc',
  standalone: true,
  imports: [NgClass, DashboardChartsHocComponent],
  templateUrl: './dashoard-hoc.component.html',
  styleUrl: './dashoard-hoc.component.scss',
})
export class DashoardHOCComponent implements OnInit {
  dashboardHocService = inject(DashboardHocService);
  exportExcelService = inject(ExportExcelService);
  activeTab: string = 'tab1';
  standingData!: StandingData;
  dashboardData!: DashboardData;
  isLoading = signal<boolean>(false);
  isExporting = signal<boolean>(false);
  ngOnInit() {
    this.dashboard();
  }
  dashboard(): void {
    this.isLoading.set(true);
    this.dashboardHocService.dashboard().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.dashboardData = data;
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
  getStandingCamp(): void {
    this.isLoading.set(true);
    this.dashboardHocService.standingCamp().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.standingData = data;
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
  selectTab(tab: string) {
    this.activeTab = tab;
    if (this.activeTab === 'tab1') {
      this.dashboard();
    } else {
      this.getStandingCamp();
    }
  }
  downloadExcel() {
    this.isExporting.set(true);
    this.exportExcelService.downloadExcelHOC().subscribe({
      next: (res: any) => {
        const link = document.createElement('a');
        link.href =
          'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
          res.fileContents;
        link.download = `${this.standingData.campName} Trainees Data.xlsx`;
        link.click();
        this.isExporting.update((v) => (v = false));
      },
      error: (err) => {
        console.log(err);
        this.isExporting.update((v) => (v = false));
      },
    });
  }
}
