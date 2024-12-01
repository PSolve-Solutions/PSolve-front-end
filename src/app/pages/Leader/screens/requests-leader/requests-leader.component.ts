import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmDeleteRequestComponent } from '../../Components/confirm-delete-request/confirm-delete-request.component';
import { RequestsLeaderService } from '../../services/requests-leader.service';
import { SystemFilterComponent } from '../../Components/system-filter/system-filter.component';
import { NgClass } from '@angular/common';
import { CasheService } from '../../../../shared/services/cashe.service';
import { SuccessMessageComponent } from '../success-message/success-message.component';
interface User {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  grade: number;
  college: number;
  gender: number;
  comment: string;
  hasLaptop: boolean;
  codeForceHandle: string;
}

interface AllTraineesInfo {
  currentPage: number;
  data: User[];
  errors: any;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isSuccess: boolean;
  message: any;
  pageSize: number;
  statusCode: number;
  totalCount: number;
  totalPages: number;
}
@Component({
  selector: 'app-requests-leader',
  standalone: true,
  imports: [
    NgSelectModule,
    ConfirmDeleteRequestComponent,
    SystemFilterComponent,
    SuccessMessageComponent,
    NgClass,
  ],
  templateUrl: './requests-leader.component.html',
  styleUrl: './requests-leader.component.scss',
})
export class RequestsLeaderComponent implements OnInit {
  requestsLeaderService = inject(RequestsLeaderService);
  casheService = inject(CasheService);
  allCamps: { id: number; name: string }[] = [];
  isLoading = signal<boolean>(false);
  isLoadingCamp = signal<boolean>(false);
  isLoadingSubmit = signal<boolean>(false);
  allTraineesInfo!: AllTraineesInfo;
  selectedIds: number[] = [];
  showModalDelete: boolean = false;
  showFilterModel: boolean = false;
  showSubmitModel: boolean = false;
  pageNumber: number = 1;
  pageSize: number = 20;
  sortbyNum: number = 0 | 1 | 2 | 3;
  applySystemFilter: boolean = false;
  filters: any;
  KeyWord: string = '';
  campId: number = 0;
  dataRequest: any[] = [];
  settingsFilterRequest: any;

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
            this.dataRequest.push(this.allTraineesInfo);
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
    this.dataRequest = [];
    this.settingsFilterRequest = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      campId: this.campId,
      applySystemFilter: this.applySystemFilter,
      filters: this.filters,
    };
    this.showFilterModel = false;
    this.casheService.clearCache();
    this.traineesRegisterations(this.settingsFilterRequest);
  }

  sortTrainee(item: any): void {
    this.sortbyNum = item;
    this.dataRequest = [];
    this.settingsFilterRequest = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      campId: this.campId,
      sortBy: this.sortbyNum,
      applySystemFilter: this.applySystemFilter,
      filters: this.filters,
    };
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

  toggleItem(id: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
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
    this.filters = data.value.filters;
    this.dataRequest = [];
    this.settingsFilterRequest = {
      pageNumber: 1,
      pageSize: this.pageSize,
      campId: this.campId,
      applySystemFilter: this.applySystemFilter,
      filters: this.filters,
    };
    this.casheService.clearCache();
    this.traineesRegisterations(this.settingsFilterRequest);
    this.closeConfirmFilter();
  }

  systemFilter(event: any): void {
    this.applySystemFilter = event.target.checked;
    this.dataRequest = [];
    this.settingsFilterRequest = {
      pageNumber: 1,
      pageSize: this.pageSize,
      campId: this.campId,
      applySystemFilter: this.applySystemFilter,
      filters: this.filters,
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
      this.dataRequest = [];
      this.settingsFilterRequest = {
        pageNumber: 1,
        pageSize: this.pageSize,
        campId: this.campId,
        applySystemFilter: this.applySystemFilter,
        filters: this.filters,
      };
      this.casheService.clearCache();
      this.traineesRegisterations(this.settingsFilterRequest);
    }
    this.showModalDelete = false;
  }

  closeRequestMessage() {
    this.showSubmitModel = false;
    this.dataRequest = [];
    this.settingsFilterRequest = {
      pageNumber: 1,
      pageSize: this.pageSize,
      campId: this.campId,
      applySystemFilter: this.applySystemFilter,
      filters: this.filters,
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

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      this.bottomReached() &&
      !this.isLoading() &&
      this.allTraineesInfo?.hasNextPage
    ) {
      this.settingsFilterRequest = {
        pageNumber: ++this.pageNumber,
        pageSize: this.pageSize,
        campId: this.campId,
        applySystemFilter: this.applySystemFilter,
        filters: this.filters,
      };
      this.traineesRegisterations(this.settingsFilterRequest);
    }
  }
  private bottomReached(): boolean {
    return (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
    );
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
