import { Component, inject, OnInit, signal } from '@angular/core';
import { CasheService } from '../../../../shared/services/cashe.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DropdownRolesComponent } from '../../Components/dropdown-roles/dropdown-roles.component';
import { TraineesLeaderService } from '../../services/trainees-leader.service';
import { OnTraineeInfo, TraineeInfo } from '../../model/trainees-leader';
import { RolesService } from '../../services/roles.service';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-trainees-leader',
  standalone: true,
  imports: [
    DropdownRolesComponent,
    NgSelectModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './trainees-leader.component.html',
  styleUrl: './trainees-leader.component.scss',
})
export class TraineesLeaderComponent implements OnInit {
  traineesLeaderService = inject(TraineesLeaderService);
  authService = inject(AuthService);
  rolesService = inject(RolesService);
  casheService = inject(CasheService);
  allTraineesInfo!: TraineeInfo;
  traineeInfo!: OnTraineeInfo;
  showSideInfo: boolean = false;
  hideSideInfo: boolean = true;
  selectedTraineeId: string = '';
  isLoading = signal<boolean>(false);
  isLoadingForSide: boolean = false;
  isDeleted: boolean = false;
  roleInfo: any;
  keywordSearch: string = '';
  sortbyNum: number = 0 | 1 | 2;
  deletedRoles: any[] = [];
  startPageIndex: number = 0;
  maxVisiblePages: number = 4;
  focusOrder: boolean = false;

  searchForm!: FormGroup;
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
    this.traineesLeaderService
      .traineesWithPagination(currentPage, pageSize, KeyWord, SortBy)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allTraineesInfo = res;
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

  onSearchInput(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.keywordSearch = searchTerm;
    this.casheService.clearCache();
    this.traineesWithPagination(1, 10, searchTerm, this.sortbyNum);
  }

  sortStaff(item: any): void {
    this.sortbyNum = item;
    this.traineesWithPagination(1, 10, this.keywordSearch, this.sortbyNum);
    this.casheService.clearCache();
  }

  showSideBar(id: string) {
    this.deletedRoles = [];
    this.selectedTraineeId = id;
    this.showSideInfo = true;
    this.hideSideInfo = false;
    this.getTraineeById(id);
  }
  handleClose() {
    this.showSideInfo = false;
    setTimeout(() => (this.hideSideInfo = true), 700);
  }

  getTraineeById(id: string) {
    this.isLoadingForSide = true;
    this.traineesLeaderService.getTraineeById(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.deletedRoles = [];
          this.traineeInfo = data;
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

  onStaffRequested(id: string) {
    this.getTraineeById(id);
  }

  deleteRole(index: number) {
    const deletedRole = this.traineeInfo.userRoles.splice(index, 1)[0];
    this.deletedRoles.push(deletedRole);
    this.roleInfo = {
      userId: this.selectedTraineeId,
      roleInfos: this.deletedRoles,
    };
  }

  restoreRole(index: number) {
    const restoredRole = this.deletedRoles.splice(index, 1)[0];
    this.traineeInfo.userRoles.push(restoredRole);
  }

  saveDeleteRoles(): void {
    this.isDeleted = true;
    this.rolesService.unAssignToRole(this.roleInfo).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          if (this.authService.currentUser().id === this.roleInfo.userId) {
            this.authService.updateUserRoles(
              this.traineeInfo.userRoles.map((r) => r.role),
              'delete'
            );
          }
          if (this.traineeInfo.userRoles.length === 0) {
            window.location.reload();
          } else {
            this.getTraineeById(this.selectedTraineeId);
          }
          this.isDeleted = false;
        } else {
          this.isDeleted = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isDeleted = false;
      },
    });
  }

  nextPage() {
    if (this.allTraineesInfo.hasNextPage) {
      this.traineesWithPagination(
        this.allTraineesInfo.currentPage + 1,
        10,
        this.keywordSearch,
        this.sortbyNum
      );
    }
  }

  previousPage() {
    if (this.allTraineesInfo.hasPreviousPage) {
      this.traineesWithPagination(
        this.allTraineesInfo.currentPage - 1,
        10,
        this.keywordSearch,
        this.sortbyNum
      );
    }
  }

  getPageRange(): number[] {
    const totalPages = this.allTraineesInfo.totalPages;
    const currentPage = this.allTraineesInfo.currentPage;
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
    this.traineesWithPagination(
      pageNum,
      10,
      this.keywordSearch,
      this.sortbyNum
    );
  }

  handleOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.handleClose();
    }
  }

  focusSelect(): void {
    this.focusOrder = true;
  }
  blurSelect(): void {
    this.focusOrder = true;
  }
}
