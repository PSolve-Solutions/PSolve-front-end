import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { CasheService } from '../../../../shared/services/cashe.service';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-table-admin',
  standalone: true,
  imports: [FormsModule, NgClass, RouterLink, DeleteUserComponent],
  templateUrl: './table-admin.component.html',
  styleUrl: './table-admin.component.scss',
})
export class TableAdminComponent implements OnChanges {
  casheService = inject(CasheService);
  clientsService = inject(ClientsService);
  toastr = inject(ToastrService);
  @Output() pageParams = new EventEmitter<{
    currentPage: number;
    rowsPerPage: number;
  }>();
  @Input() allDataTable!: any;
  @Input() isLoading: boolean = false;
  @Input() whatPlace: string = '';
  rowsPerPage: number = 5;
  currPage: number = 1;
  pageSize: number = 1;
  totalPages: number = 1;
  totalCount: number = 1;
  pages: number[] = [];
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  isDropdownOpen: boolean = false;
  showModalDelete: boolean = false;
  selectedUserId: string | null = null;
  isPastDate: boolean = false;
  isLocked: boolean = false;
  clientId: string = '';

  ngOnChanges() {
    this.generatePages();
    this.totalPages = this.allDataTable?.totalPages;
    this.pageSize = this.allDataTable?.pageSize;
    this.totalCount = this.allDataTable?.totalCount;
  }

  changeLockStatus(clientId: string): void {
    console.log(clientId);
    this.clientsService.changeLockStatus(clientId).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.casheService.clearCache();
          const i = this.allDataTable.data.find((t: any) => t.id == clientId);
          this.isLocked = i.isLocked;
          this.toastr.success(message);
        } else if (statusCode === 400) {
          this.toastr.error(message);
          this.isLoading = false;
        } else if (statusCode === 404) {
          this.toastr.error(message);
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  checkEndDateForClinet(endDate: string): boolean {
    const currentDate = new Date();
    const apiEndDate = new Date(endDate);
    this.isPastDate = apiEndDate > currentDate;
    return this.isPastDate;
  }

  showConfirmDelete(id: string) {
    this.selectedUserId = id;
    this.showModalDelete = true;
  }

  handleClose(confirmed: boolean) {
    if (confirmed && this.selectedUserId !== null) {
      this.casheService.clearCache();
      this.allDataTable.data = this.allDataTable.data.filter(
        (user: any) => user.id !== this.selectedUserId
      );
    }
    this.showModalDelete = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  selectRowsPerPage(option: number): void {
    this.isDropdownOpen = false;
    this.rowsPerPage = option;
    this.pageParams.emit({
      currentPage: this.currPage,
      rowsPerPage: this.rowsPerPage,
    });
  }

  generatePages(): void {
    this.pages = [];
    if (this.allDataTable?.totalPages <= 3) {
      for (let i = 1; i <= this.allDataTable?.totalPages; i++) {
        this.pages.push(i);
      }
    } else {
      const start = Math.max(this.currPage - 2, 1);
      const end = Math.min(this.currPage + 2, this.allDataTable?.totalPages);
      for (let i = start; i <= end; i++) {
        this.pages.push(i);
      }

      this.showEllipsis = end < this.allDataTable?.totalPages - 1;
      this.showLastPage = this.showEllipsis;
    }
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.allDataTable?.totalPages) {
      this.currPage = page;
      this.pageParams.emit({
        currentPage: this.currPage,
        rowsPerPage: this.rowsPerPage,
      });
      this.generatePages();
    }
  }
}
