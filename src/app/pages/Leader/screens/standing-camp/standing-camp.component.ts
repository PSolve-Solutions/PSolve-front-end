import { Component, inject, OnInit, signal } from '@angular/core';
import { CampLeaderService } from '../../services/camp-leader.service';
import { AchiverCamp } from '../../model/camp';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';
import { ExportExcelService } from '../../../../shared/services/export-excel.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-standing-camp',
  standalone: true,
  imports: [NgClass],
  templateUrl: './standing-camp.component.html',
  styleUrl: './standing-camp.component.scss',
})
export class StandingCampComponent implements OnInit {
  campLeaderService = inject(CampLeaderService);
  exportExcelService = inject(ExportExcelService);
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  achiverCamp!: AchiverCamp;
  isLoading = signal<boolean>(false);
  isExporting = signal<boolean>(false);
  campId: number = 0;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.campId = parseInt(params['id']);
      this.fetchAllWithPagination(this.campId);
    });
  }
  fetchAllWithPagination(campId: number): void {
    this.isLoading.set(true);
    this.campLeaderService.standingCamp(campId).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.achiverCamp = data;
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
  downloadExcel() {
    this.isExporting.set(true);
    this.exportExcelService.downloadExcelLeader(this.campId).subscribe({
      next: (res: any) => {
        const link = document.createElement('a');
        link.href =
          'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
          res.fileContents;
        link.download = `${this.achiverCamp.campName} Trainees Data.xlsx`;
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
