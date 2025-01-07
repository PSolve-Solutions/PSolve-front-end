import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequestsLeaderService } from '../../services/requests-leader.service';
import { SystemFilterComponent } from '../../Components/system-filter/system-filter.component';
import { NgClass } from '@angular/common';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { AllTraineesInfo } from '../../model/requests';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { DeleteConfirmModalComponent } from '../../../../shared/Components/delete-confirm-modal/delete-confirm-modal.component';

@Component({
  selector: 'app-requests-leader',
  standalone: true,
  imports: [
    NgSelectModule,
    SystemFilterComponent,
    SuccessMessageComponent,
    DeleteConfirmModalComponent,
    NgClass,
  ],
  templateUrl: './requests-leader.component.html',
  styleUrl: './requests-leader.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RequestsLeaderComponent implements OnInit {
  requestsLeaderService = inject(RequestsLeaderService);
  ocSidebarService = inject(OcSidebarService);
  allCamps: { id: number; name: string }[] = [];
  isLoading = signal<boolean>(false);
  isLoadingCamp = signal<boolean>(false);
  isLoadingSubmit = signal<boolean>(false);
  allTraineesInfo!: AllTraineesInfo;
  selectedIds: number[] = [];
  showModalDelete: boolean = false;
  showFilterModel: boolean = false;
  showSubmitModel: boolean = false;
  sortbyNum: number = 0 | 1 | 2 | 3;
  applySystemFilter: boolean = false;
  codeforcesFilters: any;
  vjudgeFilters: any;
  campId: number = 0;
  settingsFilterRequest: any;
  totalCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 30;
  totalPages: number = 1;
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  pages: number[] = [];

  ngOnInit() {
    this.fetchAllCamps();
  }

  traineesRegisterations(
    pageNumber: number,
    pageSize: number,
    campId: number,
    sortBy?: number,
    applySystemFilter?: boolean,
    codeforcesFilters?: any,
    vjudgeFilters?: any
  ): void {
    this.isLoading.set(true);
    this.requestsLeaderService
      .traineesRegisterations(
        pageNumber,
        pageSize,
        campId,
        sortBy,
        applySystemFilter,
        codeforcesFilters,
        vjudgeFilters
      )
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allTraineesInfo = res;
            if (this.allTraineesInfo.data.length === 0) {
              this.totalCount = 0;
              this.totalPages = 1;
            } else {
              this.totalPages = this.allTraineesInfo.totalPages;
              this.totalCount = this.allTraineesInfo.totalCount;
            }
            this.generatePages(this.totalPages);
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

  chooseCamp(item: any): void {
    this.campId = item.id;
    this.showFilterModel = false;
    this.traineesRegisterations(this.currentPage, this.pageSize, this.campId);
  }

  sortTrainee(item: any): void {
    this.sortbyNum = item;
    this.traineesRegisterations(
      this.currentPage,
      this.pageSize,
      this.campId,
      this.sortbyNum,
      this.applySystemFilter,
      this.codeforcesFilters,
      this.vjudgeFilters
    );
  }

  // open & close Filter
  showConfirmFilter() {
    this.showFilterModel = true;
  }
  closeConfirmFilter() {
    this.showFilterModel = false;
  }

  handleSaveFilter(data: any) {
    this.vjudgeFilters = data.value.filtersV;
    this.codeforcesFilters = data.value.filtersC;
    this.currentPage = 1;
    this.traineesRegisterations(
      this.currentPage,
      this.pageSize,
      this.campId,
      this.sortbyNum,
      this.applySystemFilter,
      this.codeforcesFilters,
      this.vjudgeFilters
    );
    this.closeConfirmFilter();
  }

  systemFilter(event: any): void {
    this.applySystemFilter = event.target.checked;
    this.currentPage = 1;
    this.traineesRegisterations(
      this.currentPage,
      this.pageSize,
      this.campId,
      this.sortbyNum,
      this.applySystemFilter,
      this.codeforcesFilters,
      this.vjudgeFilters
    );
  }

  // Delete
  showConfirmDelete() {
    this.showModalDelete = true;
  }

  handleClose(confirmed: boolean) {
    if (confirmed && this.selectedIds.length !== 0) {
      this.currentPage = 1;
      this.traineesRegisterations(
        this.currentPage,
        this.pageSize,
        this.campId,
        this.sortbyNum,
        this.applySystemFilter,
        this.codeforcesFilters,
        this.vjudgeFilters
      );
    }
    this.showModalDelete = false;
  }

  closeRequestMessage() {
    this.showSubmitModel = false;
    this.currentPage = 1;
    this.traineesRegisterations(
      this.currentPage,
      this.pageSize,
      this.campId,
      this.sortbyNum,
      this.applySystemFilter,
      this.codeforcesFilters,
      this.vjudgeFilters
    );
  }

  generatePages(totalPages: number): void {
    this.pages = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      const start = Math.max(this.currentPage - 2, 1);
      const end = Math.min(this.currentPage + 2, totalPages);
      for (let i = start; i <= end; i++) {
        this.pages.push(i);
      }

      this.showEllipsis = end < totalPages - 1;
      this.showLastPage = this.showEllipsis;
    }
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.allTraineesInfo?.totalPages) {
      this.currentPage = page;
      this.traineesRegisterations(
        this.currentPage,
        10,
        this.campId,
        this.sortbyNum,
        this.applySystemFilter,
        this.codeforcesFilters,
        this.vjudgeFilters
      );
    }
  }

  fetchAllCamps(): void {
    this.isLoadingCamp.set(true);
    this.requestsLeaderService.openedCampsRegister().subscribe({
      next: ({ statusCode, data, message }) => {
        if (statusCode === 200) {
          this.isLoadingCamp.update((v) => (v = false));
          this.allCamps = data;
        } else {
          this.isLoadingCamp.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingCamp.update((v) => (v = false));
      },
    });
  }

  closeModalOnOutsideClick(event: MouseEvent) {
    this.closeConfirmFilter();
  }

  submitRequests() {
    this.isLoadingSubmit.set(true);
    const info = {
      campId: this.campId,
      requestsId: this.selectedIds,
    };
    this.requestsLeaderService.traineeRequestsSubmit(info).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          this.showSubmitModel = true;
          this.isLoadingSubmit.update((v) => (v = false));
        } else {
          this.isLoadingSubmit.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);

        this.isLoadingSubmit.update((v) => (v = false));
      },
    });
  }

  // Checkbox
  toggleAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedIds = this.allTraineesInfo.data.map((user) => user.id);
      console.log(this.selectedIds, this.selectedIds.length);
    } else {
      this.selectedIds = [];
    }
  }

  toggleItem(id: number, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.selectedIds.includes(id)) {
        this.selectedIds.push(id);
      }
    } else {
      this.selectedIds = this.selectedIds.filter(
        (selectedId) => selectedId !== id
      );
    }
  }

  areAllItemsSelected(): boolean {
    return this.selectedIds.length === this.allTraineesInfo.data.length;
  }
}
