import { Component, inject, OnInit, signal } from '@angular/core';
import { CasheService } from '../../../../shared/services/cashe.service';
import { Router } from '@angular/router';
import { CampLeaderService } from '../../services/camp-leader.service';
import { EmptyCampComponent } from '../../Components/empty-camp/empty-camp.component';
import { CampInfo } from '../../model/camp';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { DatePipe, NgClass } from '@angular/common';
import { DeleteConfirmModalComponent } from '../../../../shared/Components/delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-camps-leader',
  standalone: true,
  imports: [DeleteConfirmModalComponent, NgClass, DatePipe, EmptyCampComponent],
  templateUrl: './camps-leader.component.html',
  styleUrl: './camps-leader.component.scss',
})
export class CampsLeaderComponent implements OnInit {
  campLeaderService = inject(CampLeaderService);
  ocSidebarService = inject(OcSidebarService);
  casheService = inject(CasheService);
  router = inject(Router);
  allCampsInfo!: CampInfo;
  showModalDelete: boolean = false;
  showEmptyModal: boolean = false;
  selectedItemId: number | null = null;
  selectedEmptyId: number | null = null;
  isLoading = signal<boolean>(false);
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;
  totalCount: number = 0;
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  pages: number[] = [];

  ngOnInit() {
    this.getAllCamps(this.currentPage, this.pageSize);
  }

  getAllCamps(currentPage: number, pageSize: number): void {
    this.isLoading.set(true);
    this.campLeaderService
      .getAllWithPagination(currentPage, pageSize)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allCampsInfo = res;
            this.totalPages = this.allCampsInfo.totalPages;
            this.totalCount = this.allCampsInfo.totalCount;
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

  convertToLocal(date: string): Date {
    const localDate = new Date(date);
    return localDate;
  }

  showConfirmDelete(id: number) {
    this.selectedItemId = id;
    this.showModalDelete = true;
  }

  handleClose(confirmed: boolean) {
    if (confirmed && this.selectedItemId !== null) {
      this.casheService.clearCache();
      this.getAllCamps(this.currentPage, this.pageSize);
    }
    this.showModalDelete = false;
  }

  //Empty
  showConfirmEmpty(id: number) {
    this.selectedEmptyId = id;
    this.showEmptyModal = true;
  }

  handleCloseEmpty(confirmed: boolean) {
    this.showEmptyModal = false;
  }

  campId: number = 0;

  toggleDetails(id: number) {
    if (id === this.campId) {
      this.campId = 0;
    } else {
      this.campId = id;
    }
  }

  generatePages(): void {
    this.pages = [];
    if (this.allCampsInfo?.totalPages <= 3) {
      for (let i = 1; i <= this.allCampsInfo?.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      const start = Math.max(this.currentPage - 2, 1);
      const end = Math.min(this.currentPage + 2, this.allCampsInfo?.totalPages);
      for (let i = start; i <= end; i++) {
        this.pages.push(i);
      }

      this.showEllipsis = end < this.allCampsInfo?.totalPages - 1;
      this.showLastPage = this.showEllipsis;
    }
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.allCampsInfo?.totalPages) {
      this.currentPage = page;
      this.getAllCamps(this.currentPage, this.pageSize);
    }
  }

  goToActionCamp(id: number): void {
    this.router.navigate(['leader/camps/action-camp/', id]);
  }

  goToStandingCamp(id: number): void {
    this.router.navigate(['leader/camps/standing/', id]);
  }
}
