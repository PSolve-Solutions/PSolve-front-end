import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CasheService } from '../../../../shared/services/cashe.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgClass } from '@angular/common';
import { DropdownRolesComponent } from '../../Components/dropdown-roles/dropdown-roles.component';
import { TraineesLeaderService } from '../../services/trainees-leader.service';
import { OnTraineeInfo, TraineeInfo } from '../../model/trainees-leader';
import { RolesService } from '../../services/roles.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-trainees-leader',
  standalone: true,
  imports: [DropdownRolesComponent, NgSelectModule, NgClass],
  templateUrl: './trainees-leader.component.html',
  styleUrl: './trainees-leader.component.scss',
})
export class TraineesLeaderComponent implements OnInit {
  traineesLeaderService = inject(TraineesLeaderService);
  ocSidebarService = inject(OcSidebarService);
  authService = inject(AuthService);
  rolesService = inject(RolesService);
  casheService = inject(CasheService);
  toastr = inject(ToastrService);
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
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;
  totalCount: number = 0;
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  pages: number[] = [];
  isDropdown: boolean = false;
  sortName: string = '';
  ngOnInit() {
    this.traineesWithPagination(this.currentPage, this.pageSize);
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
            this.totalPages = this.allTraineesInfo.totalPages;
            this.totalCount = this.allTraineesInfo.totalCount;
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
    this.traineesWithPagination(
      this.currentPage,
      this.pageSize,
      keyWord,
      this.sortbyNum
    );
  }
  toggleDropdown() {
    this.isDropdown = !this.isDropdown;
  }
  sortBy(item: { id: number; name: string }): void {
    this.casheService.clearCache();
    this.sortbyNum = item.id;
    this.sortName = item.name;
    this.isDropdown = false;
    this.traineesWithPagination(
      this.currentPage,
      this.pageSize,
      this.keywordSearch,
      this.sortbyNum
    );
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isInsideDropdown = targetElement.closest('#sortBy');
    if (!isInsideDropdown) {
      this.isDropdown = false;
    }
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
      next: ({ statusCode, message }) => {
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
          this.toastr.success(message, '', {
            positionClass: 'toast-bottom-left',
          });
        } else {
          this.toastr.error(message, '', {
            positionClass: 'toast-bottom-left',
          });
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
    console.log(page);
    if (page > 0 && page <= this.allTraineesInfo?.totalPages) {
      this.currentPage = page;
      this.traineesWithPagination(
        this.currentPage,
        this.pageSize,
        this.keywordSearch,
        this.sortbyNum
      );
    }
  }
  handleOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.handleClose();
    }
  }
}
