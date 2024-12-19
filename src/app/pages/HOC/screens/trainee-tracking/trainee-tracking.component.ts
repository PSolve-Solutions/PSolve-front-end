import { Component, inject, OnInit, signal } from '@angular/core';
import { TrackingService } from '../../services/tracking.service';
import { NgClass } from '@angular/common';
import { Names, Root } from '../../model/tracking-hoc';
import { Data } from '../../model/contests';

@Component({
  selector: 'app-trainee-tracking',
  standalone: true,
  imports: [NgClass],
  templateUrl: './trainee-tracking.component.html',
  styleUrl: './trainee-tracking.component.scss',
})
export class TraineeTrackingComponent implements OnInit {
  trackingService = inject(TrackingService);

  allData!: Root;
  dataRequest: Root[] = [];
  allSheets!: Names[];
  currentPage: number = 1;
  pageSize: number = 15;

  allDataContests!: Root;
  dataRequestContests: Root[] = [];
  allContests!: Names[];
  currentPageContests: number = 1;
  pageSizeContests: number = 15;

  isLoading = signal<boolean>(false);
  hoveredRow: number | null = null;
  hoveredCol: number | null = null;
  activeTab: string = 'tab1';
  problemCountMap: any;
  problemCountContest: any;
  ngOnInit() {
    this.getSheetNames();
    this.trackingTraineesSheets(this.currentPage, this.pageSize);
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
    this.isLoading.set(true);
    this.trackingService
      .trackingTraineesContests(currentPage, pageSize)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allDataContests = res;
            this.dataRequest.push(this.allDataContests);
            if (this.allContests.length > 0) {
              this.problemCountContest = this.allContests.reduce(
                (map, contest) => {
                  map[contest.id] = contest.problemCount;
                  return map;
                },
                {} as Record<number, number>
              );
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

  getSheetNames(): void {
    this.isLoading.set(true);
    this.trackingService.sheetNames().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allSheets = data;
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
    this.isLoading.set(true);
    this.trackingService.contestsNames().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allContests = data;
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
    if (atBottom && !this.isLoading() && this.allDataContests?.hasNextPage) {
      this.trackingTraineesContests(
        ++this.currentPageContests,
        this.pageSizeContests
      );
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
    this.currentPageContests = 1;
    if (this.activeTab !== 'tab1') {
      this.getContestsNames();
      this.trackingTraineesContests(
        this.currentPageContests,
        this.pageSizeContests
      );
    } else {
      this.trackingTraineesSheets(this.currentPage, this.pageSize);
    }
  }
}
