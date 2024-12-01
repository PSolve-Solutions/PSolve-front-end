import { CommonModule, NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Admins } from '../../model/admins';

@Component({
  selector: 'app-table-admin',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './table-admin.component.html',
  styleUrl: './table-admin.component.scss',
})
export class TableAdminComponent implements OnChanges {
  @Output() currentPage = new EventEmitter<number>();
  @Output() rowsPerPage = new EventEmitter<number>();
  @Input('allAdmins') allDataTable!: Admins;
  @Input() isLoading: boolean = false;
  selectedItems = new Set<string>();
  isAllSelected: boolean = false;
  currPage: number = 1;
  pageSize: number = 1;
  totalPages: number = 1;
  totalCount: number = 1;
  pages: number[] = [];
  showEllipsis: boolean = false;
  showLastPage: boolean = false;
  isDropdownOpen: boolean = false;

  ngOnChanges() {
    this.generatePages();
    this.totalPages = this.allDataTable?.totalPages;
    this.pageSize = this.allDataTable?.pageSize;
    this.totalCount = this.allDataTable?.totalCount;
  }

  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      this.allDataTable.data.forEach((user) => this.selectedItems.add(user.id));
    } else {
      this.selectedItems.clear();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSelectOne(id: string) {
    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id);
      this.isAllSelected = false;
    } else {
      this.selectedItems.add(id);
      this.isAllSelected =
        this.selectedItems.size === this.allDataTable.data.length;
    }
  }

  deleteRow(id: string, index: number) {
    this.allDataTable.data.splice(index, 1);
    // fun Api
  }

  selectRowsPerPage(option: number): void {
    this.isDropdownOpen = false;
    this.rowsPerPage.emit(option);
  }

  generatePages(): void {
    this.pages = [];
    if (this.allDataTable?.totalPages <= 5) {
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
      this.currentPage.emit(this.currPage);
      this.generatePages();
    }
  }
}
