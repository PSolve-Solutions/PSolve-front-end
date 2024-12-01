import { Component, inject, OnInit, signal } from '@angular/core';
import { CasheService } from '../../../../shared/services/cashe.service';
import { StaffLeaderService } from '../../services/staff-leader.service';
import { OnStaffInfo, StaffInfo } from '../../model/staff';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DropdownRolesComponent } from '../../Components/dropdown-roles/dropdown-roles.component';
import { RolesService } from '../../services/roles.service';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-staff-leader',
  standalone: true,
  imports: [
    DropdownRolesComponent,
    NgSelectModule,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './staff-leader.component.html',
  styleUrl: './staff-leader.component.scss',
})
export class StaffLeaderComponent implements OnInit {
  staffLeaderService = inject(StaffLeaderService);
  authService = inject(AuthService);
  rolesService = inject(RolesService);
  casheService = inject(CasheService);
  allStaffInfo!: StaffInfo;
  staffInfo!: OnStaffInfo;
  showSideInfo: boolean = false;
  hideSideInfo: boolean = true;
  selectedStaffId: string = '';
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

    this.staffWithPagination(1, 10, this.keywordSearch, this.sortbyNum);
  }

  staffWithPagination(
    currentPage: number,
    pageSize: number,
    KeyWord?: string,
    SortBy?: number
  ): void {
    this.isLoading.set(true);
    this.staffLeaderService
      .staffWithPagination(currentPage, pageSize, KeyWord, SortBy)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allStaffInfo = res;
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
    this.staffWithPagination(1, 10, searchTerm, this.sortbyNum);
  }

  sortStaff(item: any): void {
    this.sortbyNum = item;
    this.staffWithPagination(1, 10, this.keywordSearch, this.sortbyNum);
    this.casheService.clearCache();
  }

  showSideBar(id: string) {
    this.deletedRoles = [];
    this.selectedStaffId = id;
    this.showSideInfo = true;
    this.hideSideInfo = false;
    this.getStaffById(id);
  }
  handleClose() {
    this.showSideInfo = false;
    setTimeout(() => (this.hideSideInfo = true), 700);
  }

  getStaffById(id: string) {
    this.isLoadingForSide = true;
    this.staffLeaderService.getStaffById(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.deletedRoles = [];
          this.staffInfo = data;
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
    this.getStaffById(id);
  }

  deleteRole(index: number) {
    const deletedRole = this.staffInfo.userRoles.splice(index, 1)[0];
    // delete deletedRole.campName;
    this.deletedRoles.push(deletedRole);
    this.roleInfo = {
      userId: this.selectedStaffId,
      roleInfos: this.deletedRoles,
    };
  }
  restoreRole(index: number) {
    const restoredRole = this.deletedRoles.splice(index, 1)[0];
    this.staffInfo.userRoles.push(restoredRole);
  }

  saveDeleteRoles(): void {
    this.isDeleted = true;
    this.rolesService.unAssignToRole(this.roleInfo).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          if (this.authService.currentUser().id === this.roleInfo.userId) {
            this.authService.updateUserRoles(
              this.staffInfo.userRoles.map((r) => r.role),
              'delete'
            );
          }
          if (this.staffInfo.userRoles.length === 0) {
            window.location.reload();
          } else {
            this.getStaffById(this.selectedStaffId);
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
    if (this.allStaffInfo.hasNextPage) {
      this.staffWithPagination(
        this.allStaffInfo.currentPage + 1,
        10,
        this.keywordSearch,
        this.sortbyNum
      );
    }
  }

  previousPage() {
    if (this.allStaffInfo.hasPreviousPage) {
      this.staffWithPagination(
        this.allStaffInfo.currentPage - 1,
        10,
        this.keywordSearch,
        this.sortbyNum
      );
    }
  }

  getPageRange(): number[] {
    const totalPages = this.allStaffInfo.totalPages;
    const currentPage = this.allStaffInfo.currentPage;
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
    this.staffWithPagination(pageNum, 10, this.keywordSearch, this.sortbyNum);
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
