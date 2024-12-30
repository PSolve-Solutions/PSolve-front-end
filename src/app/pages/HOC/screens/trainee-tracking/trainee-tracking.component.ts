import { Component, inject, OnInit, signal } from '@angular/core';
import { TrackingService } from '../../services/tracking.service';
import { NgClass } from '@angular/common';
import { Names, Root } from '../../model/tracking-hoc';
import { Data } from '../../model/contests';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-trainee-tracking',
  standalone: true,
  imports: [NgClass],
  templateUrl: './trainee-tracking.component.html',
  styleUrl: './trainee-tracking.component.scss',
})
export class TraineeTrackingComponent implements OnInit {
  trackingService = inject(TrackingService);
  ocSidebarService = inject(OcSidebarService);

  allData!: Root;
  dataRequest: Root[] = [];
  allSheets!: Names[];
  currentPage: number = 1;
  pageSize: number = 8;

  allDataContests!: Root;
  dataRequestContests: Root[] = [];
  allContests!: Names[];

  isLoading = signal<boolean>(false);
  isLoading2 = signal<boolean>(false);
  hoveredRow: number | null = null;
  hoveredCol: number | null = null;
  activeTab: string = 'tab1';
  problemCountMap: any;
  problemCountContest: any;
  lenContest: number = 0;
  lenSheet: number = 0;
  ngOnInit() {
    this.getSheetNames();
  }
  trackingTraineesSheets(currentPage: number, pageSize: number): void {
    this.isLoading.set(true);
    this.trackingService
      .trackingTraineesSheets(currentPage, pageSize)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allData = res;
            this.dataRequest.push(this.allData);
            if (this.allSheets.length > 0) {
              this.problemCountMap = this.allSheets.reduce((map, sheet) => {
                map[sheet.id] = sheet.problemCount;
                return map;
              }, {} as Record<number, number>);
            }
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

  trackingTraineesContests(currentPage: number, pageSize: number): void {
    this.isLoading2.set(true);
    this.trackingService
      .trackingTraineesContests(currentPage, pageSize)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allDataContests = res;
            this.dataRequestContests.push(this.allDataContests);
            if (this.allContests.length > 0) {
              this.problemCountContest = this.allContests.reduce(
                (map, contest) => {
                  map[contest.id] = contest.problemCount;
                  return map;
                },
                {} as Record<number, number>
              );
            }
            this.isLoading2.update((v) => (v = false));
          } else {
            this.isLoading2.update((v) => (v = false));
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading2.update((v) => (v = false));
        },
      });
  }

  getSheetNames(): void {
    this.isLoading.set(true);
    this.trackingService.sheetNames().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allSheets = data;
          this.trackingTraineesSheets(this.currentPage, this.pageSize);
          this.lenSheet = this.allSheets.length;
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
  getContestsNames(): void {
    this.isLoading2.set(true);
    this.trackingService.contestsNames().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allContests = data;
          this.trackingTraineesContests(this.currentPage, this.pageSize);
          this.lenContest = this.allContests.length;
          this.isLoading2.update((v) => (v = false));
        } else {
          this.isLoading2.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading2.update((v) => (v = false));
      },
    });
  }

  loadMoreData(event: any): void {
    const element = event.target;
    const bottomThreshold = 5;
    const atBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - bottomThreshold;
    if (atBottom && !this.isLoading() && this.allData?.hasNextPage) {
      this.trackingTraineesSheets(++this.currentPage, this.pageSize);
    }
  }
  loadMoreDataContest(event: any): void {
    const element = event.target;
    const bottomThreshold = 5;
    const atBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - bottomThreshold;
    if (atBottom && !this.isLoading2() && this.allDataContests?.hasNextPage) {
      this.trackingTraineesContests(++this.currentPage, this.pageSize);
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

  selectTab(tab: string) {
    this.dataRequest = [];
    this.dataRequestContests = [];
    this.activeTab = tab;
    this.currentPage = 1;
    if (this.activeTab !== 'tab1') {
      this.getContestsNames();
    } else {
      this.trackingTraineesSheets(this.currentPage, this.pageSize);
    }
  }
}
