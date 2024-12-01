import { Component, inject, OnInit, signal } from '@angular/core';
import { CasheService } from '../../../../shared/services/cashe.service';
import { Router } from '@angular/router';
import { ConfirmCampComponent } from '../../Components/confirm-camp/confirm-camp.component';
import { CampLeaderService } from '../../services/camp-leader.service';
import { EmptyCampComponent } from '../../Components/empty-camp/empty-camp.component';
import { CampInfo } from '../../model/camp';

@Component({
  selector: 'app-camps-leader',
  standalone: true,
  imports: [ConfirmCampComponent, EmptyCampComponent],
  templateUrl: './camps-leader.component.html',
  styleUrl: './camps-leader.component.scss',
})
export class CampsLeaderComponent implements OnInit {
  campLeaderService = inject(CampLeaderService);
  casheService = inject(CasheService);
  router = inject(Router);
  allCampsInfo!: CampInfo;
  showModal: boolean = false;
  showEmptyModal: boolean = false;
  selectedItemId: number | null = null;
  selectedEmptyId: number | null = null;
  isLoading = signal<boolean>(false);
  startPageIndex: number = 0;
  maxVisiblePages: number = 4;
  ngOnInit() {
    this.fetchAllWithPagination(1, 10);
  }

  fetchAllWithPagination(currentPage: number, pageSize: number): void {
    this.isLoading.set(true);
    this.campLeaderService
      .getAllWithPagination(currentPage, pageSize)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allCampsInfo = res;
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

  showConfirmDelete(id: number) {
    this.selectedItemId = id;
    this.showModal = true;
  }

  handleClose(confirmed: boolean) {
    if (confirmed && this.selectedItemId !== null) {
      this.casheService.clearCache();
      this.fetchAllWithPagination(this.allCampsInfo?.currentPage, 10);
    }
    this.showModal = false;
  }

  //Empty
  showConfirmEmpty(id: number) {
    this.selectedEmptyId = id;
    this.showEmptyModal = true;
  }

  handleCloseEmpty(confirmed: boolean) {
    this.showEmptyModal = false;
  }

  nextPage() {
    if (this.allCampsInfo.hasNextPage) {
      this.fetchAllWithPagination(this.allCampsInfo.currentPage + 1, 10);
    }
  }

  previousPage() {
    if (this.allCampsInfo.hasPreviousPage) {
      this.fetchAllWithPagination(this.allCampsInfo.currentPage - 1, 10);
    }
  }

  getPageRange(): number[] {
    const totalPages = this.allCampsInfo.totalPages;
    const currentPage = this.allCampsInfo.currentPage;
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

  gotoPage(pageNum: number): void {
    this.fetchAllWithPagination(pageNum, 10);
  }

  goToActionCamp(id: number): void {
    this.router.navigate(['leader/camps/action-camp/', id]);
  }

  goToStandingCamp(id: number): void {
    this.router.navigate(['leader/camps/standing/', id]);
  }
}
