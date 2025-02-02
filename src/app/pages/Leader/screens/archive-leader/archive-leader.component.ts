import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { OnArchiveUserInfo, ArchiveInfo } from '../../model/archive-leader';
import { CasheService } from '../../../../shared/services/cashe.service';
import { ArchiveLeaderService } from '../../services/archive-leader.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
@Component({
  selector: 'app-archive-leader',
  standalone: true,
  imports: [NgSelectModule, NgClass],
  templateUrl: './archive-leader.component.html',
  styleUrl: './archive-leader.component.scss',
})
export class ArchiveLeaderComponent implements OnInit {
  archiveLeaderService = inject(ArchiveLeaderService);
  casheService = inject(CasheService);
  ocSidebarService = inject(OcSidebarService);
  traineeArchiveInfo!: ArchiveInfo;
  onetraineeArchiveInfo!: OnArchiveUserInfo;
  staffArchiveInfo!: ArchiveInfo;
  onestaffArchiveInfo!: OnArchiveUserInfo;
  showSideInfo: boolean = false;
  hideSideInfo: boolean = true;
  selectedUserId: number = 0;
  isLoading = signal<boolean>(false);
  isLoadingForSide: boolean = false;
  keywordSearch: string = '';
  sortbyNum: number = 0 | 1 | 2;
  sortbyNumStaff: number = 0 | 1 | 2;
  activeTab: string = 'tab1';
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;
  totalCount: number = 0;
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  pages: number[] = [];
  ngOnInit() {
    this.traineesWithPagination(this.currentPage, this.pageSize);
  }
  traineesWithPagination(
    currentPage: number,
    pageSize: number,
    KeyWord?: string,
    SortBy?: number
  ): void {
    this.isLoading.set(true);
    this.archiveLeaderService
      .traineesArchiveWithPagination(currentPage, pageSize, KeyWord, SortBy)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.traineeArchiveInfo = res;
            this.totalPages = this.traineeArchiveInfo.totalPages;
            this.totalCount = this.traineeArchiveInfo.totalCount;
            this.generatePages();
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
  staffArchiveWithPagination(
    currentPage: number,
    pageSize: number,
    KeyWord?: string,
    SortBy?: number
  ): void {
    this.isLoading.set(true);
    this.archiveLeaderService
      .staffArchiveWithPagination(currentPage, pageSize, KeyWord, SortBy)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.staffArchiveInfo = res;
            this.totalPages = this.staffArchiveInfo.totalPages;
            this.totalCount = this.staffArchiveInfo.totalCount;
            this.generatePages();
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
  getTraineeById(id: number) {
    this.isLoadingForSide = true;
    this.archiveLeaderService.getTraineeArchiveById(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.onetraineeArchiveInfo = data;
          this.isLoadingForSide = false;
        } else {
          this.isLoadingForSide = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingForSide = false;
      },
    });
  }
  getStaffArchiveById(id: number) {
    this.isLoadingForSide = true;
    this.archiveLeaderService.getStaffArchiveById(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.onestaffArchiveInfo = data;
          this.isLoadingForSide = false;
        } else {
          this.isLoadingForSide = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingForSide = false;
      },
    });
  }
  showSideBar(id: number) {
    this.selectedUserId = id;
    this.showSideInfo = true;
    this.hideSideInfo = false;
    if (this.activeTab === 'tab1') {
      this.getTraineeById(id);
    } else {
      this.getStaffArchiveById(id);
    }
  }
  handleClose() {
    this.showSideInfo = false;
    setTimeout(() => (this.hideSideInfo = true), 700);
  }
  onSearchInput(keyWord: string) {
    this.keywordSearch = keyWord;
    this.casheService.clearCache();
    if (this.activeTab === 'tab1') {
      this.traineesWithPagination(
        this.currentPage,
        this.pageSize,
        this.keywordSearch,
        this.sortbyNum
      );
    } else {
      this.staffArchiveWithPagination(
        this.currentPage,
        this.pageSize,
        this.keywordSearch,
        this.sortbyNumStaff
      );
    }
  }
  sortBy(item: number): void {
    this.casheService.clearCache();
    this.sortbyNum = item;
    this.traineesWithPagination(
      this.currentPage,
      this.pageSize,
      this.keywordSearch,
      this.sortbyNum
    );
  }
  sortByStaff(item: number): void {
    this.casheService.clearCache();
    this.sortbyNumStaff = item;
    this.staffArchiveWithPagination(
      this.currentPage,
      this.pageSize,
      this.keywordSearch,
      this.sortbyNumStaff
    );
  }
  generatePages(): void {
    this.pages = [];
    if (this.activeTab === 'tab1') {
      if (this.traineeArchiveInfo?.totalPages <= 3) {
        for (let i = 1; i <= this.traineeArchiveInfo?.totalPages; i++) {
          this.pages.push(i);
        }
      } else {
        const start = Math.max(this.currentPage - 2, 1);
        const end = Math.min(
          this.currentPage + 2,
          this.traineeArchiveInfo?.totalPages
        );
        for (let i = start; i <= end; i++) {
          this.pages.push(i);
        }
        this.showEllipsis = end < this.traineeArchiveInfo?.totalPages - 1;
        this.showLastPage = this.showEllipsis;
      }
    } else {
      if (this.staffArchiveInfo?.totalPages <= 3) {
        for (let i = 1; i <= this.staffArchiveInfo?.totalPages; i++) {
          this.pages.push(i);
        }
      } else {
        const start = Math.max(this.currentPage - 2, 1);
        const end = Math.min(
          this.currentPage + 2,
          this.staffArchiveInfo?.totalPages
        );
        for (let i = start; i <= end; i++) {
          this.pages.push(i);
        }
        this.showEllipsis = end < this.staffArchiveInfo?.totalPages - 1;
        this.showLastPage = this.showEllipsis;
      }
    }
  }
  changePage(page: number): void {
    if (this.activeTab === 'tab1') {
      if (page > 0 && page <= this.traineeArchiveInfo?.totalPages) {
        this.currentPage = page;
        this.traineesWithPagination(
          this.currentPage,
          this.pageSize,
          this.keywordSearch,
          this.sortbyNum
        );
      }
    } else {
      if (page > 0 && page <= this.staffArchiveInfo?.totalPages) {
        this.currentPage = page;
        this.staffArchiveWithPagination(
          this.currentPage,
          this.pageSize,
          this.keywordSearch,
          this.sortbyNumStaff
        );
      }
    }
  }
  closeSort() {}
  handleOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.handleClose();
      this.closeSort();
    }
  }
  selectTab(tab: string) {
    this.activeTab = tab;
    if (this.activeTab !== 'tab1') {
      this.casheService.clearCache();
      this.staffArchiveWithPagination(1, 8, this.keywordSearch);
    } else {
      this.casheService.clearCache();
      this.traineesWithPagination(1, 8, this.keywordSearch);
    }
  }
}
