import { Component, inject, OnInit, signal } from '@angular/core';
import { CasheService } from '../../../../shared/services/cashe.service';
import { StaffLeaderService } from '../../services/staff-leader.service';
import { OnStaffInfo, StaffInfo } from '../../model/staff';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgClass, NgStyle } from '@angular/common';
import { DropdownRolesComponent } from '../../Components/dropdown-roles/dropdown-roles.component';
import { RolesService } from '../../services/roles.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-staff-leader',
  standalone: true,
  imports: [DropdownRolesComponent, NgSelectModule, NgClass],
  templateUrl: './staff-leader.component.html',
  styleUrl: './staff-leader.component.scss',
})
export class StaffLeaderComponent implements OnInit {
  staffLeaderService = inject(StaffLeaderService);
  ocSidebarService = inject(OcSidebarService);
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
  focusOrder: boolean = false;

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  pages: number[] = [];

  ngOnInit() {
    this.staffWithPagination(this.currentPage, this.pageSize);
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
            this.totalPages = this.allStaffInfo.totalPages;
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

  onSearchInput(keyWord: string) {
    this.keywordSearch = keyWord;
    this.casheService.clearCache();
    this.staffWithPagination(
      this.currentPage,
      this.pageSize,
      keyWord,
      this.sortbyNum
    );
  }

  sortBy(item: number): void {
    this.casheService.clearCache();
    this.sortbyNum = item;
    console.log(item, this.sortbyNum);
    this.staffWithPagination(
      this.currentPage,
      this.pageSize,
      this.keywordSearch,
      this.sortbyNum
    );
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

  generatePages(): void {
    this.pages = [];
    if (this.allStaffInfo?.totalPages <= 3) {
      for (let i = 1; i <= this.allStaffInfo?.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      const start = Math.max(this.currentPage - 2, 1);
      const end = Math.min(this.currentPage + 2, this.allStaffInfo?.totalPages);
      for (let i = start; i <= end; i++) {
        this.pages.push(i);
      }

      this.showEllipsis = end < this.allStaffInfo?.totalPages - 1;
      this.showLastPage = this.showEllipsis;
    }
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.allStaffInfo?.totalPages) {
      this.currentPage = page;
      this.staffWithPagination(
        this.currentPage,
        this.pageSize,
        this.keywordSearch,
        this.sortbyNum
      );
      this.generatePages();
    }
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
