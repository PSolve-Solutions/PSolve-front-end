import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  OnArchiveUserInfo,
  TraineeArchiveInfo,
} from '../../model/archive-leader';
import { CasheService } from '../../../../shared/services/cashe.service';
import { ArchiveLeaderService } from '../../services/archive-leader.service';

@Component({
  selector: 'app-archive-leader',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, NgClass],
  templateUrl: './archive-leader.component.html',
  styleUrl: './archive-leader.component.scss',
})
export class ArchiveLeaderComponent implements OnInit {
  archiveLeaderService = inject(ArchiveLeaderService);
  casheService = inject(CasheService);
  traineeArchiveInfo!: TraineeArchiveInfo;
  onetraineeArchiveInfo!: OnArchiveUserInfo;
  staffArchiveInfo!: any;
  onestaffArchiveInfo!: OnArchiveUserInfo;
  showSideInfo: boolean = false;
  hideSideInfo: boolean = true;
  selectedUserId: number = 0;
  isLoading = signal<boolean>(false);
  isLoadingForSide: boolean = false;
  keywordSearch: string = '';
  sortbyNum: number = 0 | 1 | 2;
  searchForm!: FormGroup;
  activeTab: string = 'tab1';
  startPageIndex: number = 0;
  maxVisiblePages: number = 4;

  ngOnInit() {
    this.searchForm = new FormGroup({
      searchInput: new FormControl(''),
      sortNumber: new FormControl(null),
    });
    this.traineesWithPagination(1, 10, this.keywordSearch, this.sortbyNum);
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

  onSearchInput(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.keywordSearch = searchTerm;
    this.casheService.clearCache();

    if (this.activeTab === 'tab1') {
      this.traineesWithPagination(1, 10, searchTerm, this.sortbyNum);
    } else {
      this.staffArchiveWithPagination(1, 10, searchTerm, this.sortbyNum);
    }
  }

  sortStaff(item: any): void {
    this.sortbyNum = item;
    if (this.activeTab === 'tab1') {
      this.traineesWithPagination(1, 10, this.keywordSearch, this.sortbyNum);
    } else {
      this.staffArchiveWithPagination(
        1,
        10,
        this.keywordSearch,
        this.sortbyNum
      );
    }
    this.casheService.clearCache();
  }

  nextPage() {
    if (this.activeTab === 'tab1') {
      if (this.traineeArchiveInfo.hasNextPage) {
        this.traineesWithPagination(
          this.traineeArchiveInfo.currentPage + 1,
          10,
          this.keywordSearch,
          this.sortbyNum
        );
      }
    } else {
      if (this.staffArchiveInfo.hasNextPage) {
        this.staffArchiveWithPagination(
          this.staffArchiveInfo.currentPage + 1,
          10,
          this.keywordSearch,
          this.sortbyNum
        );
      }
    }
  }

  getPageRange(): number[] {
    if (this.activeTab === 'tab1') {
      const totalPages = this.traineeArchiveInfo.totalPages;
      const currentPage = this.traineeArchiveInfo.currentPage;
      const visiblePages = [];

      if (currentPage > this.startPageIndex + this.maxVisiblePages) {
        this.startPageIndex = currentPage - this.maxVisiblePages;
      } else if (currentPage <= this.startPageIndex) {
        this.startPageIndex = currentPage - 1;
      }

      const endPage = Math.min(
        this.startPageIndex + this.maxVisiblePages,
        totalPages
      );

      for (let i = this.startPageIndex + 1; i <= endPage; i++) {
        visiblePages.push(i);
      }

      return visiblePages;
    } else {
      const totalPages = this.staffArchiveInfo.totalPages;
      const currentPage = this.staffArchiveInfo.currentPage;
      const visiblePages = [];

      if (currentPage > this.startPageIndex + this.maxVisiblePages) {
        this.startPageIndex = currentPage - this.maxVisiblePages;
      } else if (currentPage <= this.startPageIndex) {
        this.startPageIndex = currentPage - 1;
      }

      const endPage = Math.min(
        this.startPageIndex + this.maxVisiblePages,
        totalPages
      );

      for (let i = this.startPageIndex + 1; i <= endPage; i++) {
        visiblePages.push(i);
      }

      return visiblePages;
    }
  }

  gotoPage(pageNum: number): void {
    if (this.activeTab === 'tab1') {
      this.traineesWithPagination(
        pageNum,
        10,
        this.keywordSearch,
        this.sortbyNum
      );
    } else {
      this.staffArchiveWithPagination(
        pageNum,
        10,
        this.keywordSearch,
        this.sortbyNum
      );
    }
  }

  previousPage() {
    if (this.activeTab === 'tab1') {
      if (this.traineeArchiveInfo.hasPreviousPage) {
        this.traineesWithPagination(
          this.traineeArchiveInfo.currentPage - 1,
          10,
          this.keywordSearch,
          this.sortbyNum
        );
      }
    } else {
      if (this.staffArchiveInfo.hasPreviousPage) {
        this.staffArchiveWithPagination(
          this.staffArchiveInfo.currentPage + 1,
          10,
          this.keywordSearch,
          this.sortbyNum
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
      this.staffArchiveWithPagination(
        1,
        10,
        this.keywordSearch,
        this.sortbyNum
      );
    } else {
      this.traineesWithPagination(1, 10, this.keywordSearch, this.sortbyNum);
    }
  }
}
