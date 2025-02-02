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
  allTraineesInfoData: AllTraineesInfo[] = [];
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
  pageSize: number = 5;
  totalPages: number = 1;
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
            this.allTraineesInfoData.push(this.allTraineesInfo);
            if (this.allTraineesInfo.data.length === 0) {
              this.totalCount = 0;
            } else {
              this.totalCount = this.allTraineesInfo.totalCount;
              this.currentPage = this.allTraineesInfo.currentPage;
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
  chooseCamp(item: any): void {
    this.allTraineesInfoData = [];
    this.campId = item.id;
    this.showFilterModel = false;
    this.currentPage = 1;
    this.traineesRegisterations(this.currentPage, this.pageSize, this.campId);
  }
  sortTrainee(item: any): void {
    this.allTraineesInfoData = [];
    this.sortbyNum = item;
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
  // open & close Filter
  showConfirmFilter() {
    this.showFilterModel = true;
  }
  closeConfirmFilter() {
    this.showFilterModel = false;
  }
  handleSaveFilter(data: any) {
    this.allTraineesInfoData = [];
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
    this.allTraineesInfoData = [];
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
      this.allTraineesInfoData = [];
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
    this.allTraineesInfoData = [];
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
  changePage(): void {
    if (this.allTraineesInfo?.hasNextPage) {
      this.currentPage = this.currentPage + 1;
      this.traineesRegisterations(
        this.currentPage,
        5,
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
