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
import { CasheService } from '../../../../shared/services/cashe.service';
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
  casheService = inject(CasheService);
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
  KeyWord: string = '';
  campId: number = 0;
  settingsFilterRequest: any;

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  pages: number[] = [];

  ngOnInit() {
    this.fetchAllCamps();
  }

  traineesRegisterations(settingsRequest: any): void {
    this.isLoading.set(true);
    this.requestsLeaderService
      .traineesRegisterations(settingsRequest)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allTraineesInfo = res;
            this.totalPages = this.allTraineesInfo.totalPages;
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

  chooseCamp(item: any): void {
    this.campId = item.id;
    this.settingsFilterRequest = {
      // pageNumber: 1,
      // pageSize: this.pageSize,
      campId: this.campId,
    };
    this.showFilterModel = false;
    this.casheService.clearCache();
    this.traineesRegisterations(this.settingsFilterRequest);
  }

  sortTrainee(item: any): void {
    this.sortbyNum = item;
    this.settingsFilterRequest = {
      // pageNumber: this.currentPage,
      // pageSize: this.pageSize,
      campId: this.campId,
      sortBy: this.sortbyNum,
      applySystemFilter: this.applySystemFilter,
      vjudgeFilters: this.vjudgeFilters,
      codeforcesFilters: this.codeforcesFilters,
    };
    this.casheService.clearCache();
    this.traineesRegisterations(this.settingsFilterRequest);
  }

  // Checkbox
  toggleAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedIds = this.allTraineesInfo.data.map((user) => user.id);
    } else {
      this.selectedIds = [];
    }
  }

  toggleItem(id: number, event: any): void {
    const isChecked = event.target.checked;
    console.log(isChecked);
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

  // Filter
  showConfirmFilter() {
    this.showFilterModel = true;
  }
  closeConfirmFilter() {
    this.showFilterModel = false;
  }

  handleSaveFilter(data: any) {
    this.vjudgeFilters = data.value.filtersV;
    this.codeforcesFilters = data.value.filtersC;
    if (this.vjudgeFilters.length > 0 || this.codeforcesFilters.length > 0) {
      this.settingsFilterRequest = {
        // pageNumber: 1,
        // pageSize: this.pageSize,
        campId: this.campId,
        sortBy: this.sortbyNum,
        applySystemFilter: this.applySystemFilter,
        vjudgeFilters: this.vjudgeFilters,
        codeforcesFilters: this.codeforcesFilters,
      };
      this.casheService.clearCache();
      this.traineesRegisterations(this.settingsFilterRequest);
    }
    this.closeConfirmFilter();
  }

  systemFilter(event: any): void {
    this.applySystemFilter = event.target.checked;
    this.settingsFilterRequest = {
      // pageNumber: 1,
      // pageSize: this.pageSize,
      sortBy: this.sortbyNum,
      campId: this.campId,
      applySystemFilter: this.applySystemFilter,
    };
    this.casheService.clearCache();
    this.traineesRegisterations(this.settingsFilterRequest);
  }

  // Delete
  showConfirmDelete() {
    this.showModalDelete = true;
  }

  handleClose(confirmed: boolean) {
    if (confirmed && this.selectedIds.length !== 0) {
      this.settingsFilterRequest = {
        // pageNumber: 1,
        // pageSize: this.pageSize,
        sortBy: this.sortbyNum,
        campId: this.campId,
        applySystemFilter: this.applySystemFilter,
        vjudgeFilters: this.vjudgeFilters,
        codeforcesFilters: this.codeforcesFilters,
      };
      this.casheService.clearCache();
      this.traineesRegisterations(this.settingsFilterRequest);
    }
    this.showModalDelete = false;
  }

  closeRequestMessage() {
    this.showSubmitModel = false;
    this.settingsFilterRequest = {
      // pageNumber: 1,
      // pageSize: this.pageSize,
      campId: this.campId,
      sortBy: this.sortbyNum,
      applySystemFilter: this.applySystemFilter,
      vjudgeFilters: this.vjudgeFilters,
      codeforcesFilters: this.codeforcesFilters,
    };
    this.casheService.clearCache();
    this.traineesRegisterations(this.settingsFilterRequest);
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

  generatePages(): void {
    this.pages = [];
    if (this.allTraineesInfo?.totalPages <= 3) {
      for (let i = 1; i <= this.allTraineesInfo?.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      const start = Math.max(this.currentPage - 2, 1);
      const end = Math.min(
        this.currentPage + 2,
        this.allTraineesInfo?.totalPages
      );
      for (let i = start; i <= end; i++) {
        this.pages.push(i);
      }

      this.showEllipsis = end < this.allTraineesInfo?.totalPages - 1;
      this.showLastPage = this.showEllipsis;
    }
  }

  changePage(page: number): void {
    // if (page > 0 && page <= this.allTraineesInfo?.totalPages) {
    //   this.currentPage = page;
    //   this.settingsFilterRequest = {
    //     pageNumber: this.currentPage,
    //     pageSize: this.pageSize,
    //     campId: this.campId,
    //     applySystemFilter: this.applySystemFilter,
    //     vjudgeFilters: this.vjudgeFilters,
    //     codeforcesFilters: this.codeforcesFilters,
    //   };
    //   this.generatePages();
    // }
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
}
