import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { WeeklyFilterService } from '../../services/weekly-filter.service';
import { CasheService } from '../../../../shared/services/cashe.service';
import { UsersOther, UsersWeekly } from '../../model/weekly';
import { ConfirmDeleteHocComponent } from '../../components/confirm-delete-hoc/confirm-delete-hoc.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
@Component({
  selector: 'app-weekly-filter-hoc',
  standalone: true,
  imports: [NgClass, ConfirmDeleteHocComponent, ToastrModule],
  templateUrl: './weekly-filter-hoc.component.html',
  styleUrl: './weekly-filter-hoc.component.scss',
})
export class WeeklyFilterHOCComponent implements OnInit {
  weeklyFilterService = inject(WeeklyFilterService);
  ocSidebarService = inject(OcSidebarService);
  casheService = inject(CasheService);
  toastr = inject(ToastrService);
  filterData!: UsersWeekly[];
  otherData!: UsersOther[];
  isLoading = signal<boolean>(false);
  isLoadingConfirm = signal<boolean>(false);
  activeTab: string = 'tab1';
  selectedUsers: Set<string> = new Set();
  showModal: boolean = false;
  selectedItemId: string | null = null;
  ngOnInit() {
    this.getToFilter();
  }
  getToFilter(): void {
    this.isLoading.set(true);
    this.weeklyFilterService.getToFilter().subscribe({
      next: ({ data, statusCode }) => {
        if (statusCode === 200) {
          this.filterData = data;
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
  getOthers(traineesIds: any): void {
    this.isLoading.set(true);
    this.weeklyFilterService.getOthers(traineesIds).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.otherData = data;
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
  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.filterData.forEach((user) => this.selectedUsers.add(user.id));
    } else {
      this.selectedUsers.clear();
    }
  }
  areAllSelected(): boolean {
    return (
      this.filterData.length > 0 &&
      this.selectedUsers.size === this.filterData.length
    );
  }
  toggleSelection(userId: string) {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
  }
  isSelected(userId: string): boolean {
    return this.selectedUsers.has(userId);
  }
  removeSelectedUsers(): void {
    this.isLoadingConfirm.set(true);
    const selectedIds = Array.from(this.selectedUsers);
    this.weeklyFilterService.filterTrainees(selectedIds).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.filterData = this.filterData.filter(
            (user) => !this.selectedUsers.has(user.id)
          );
          this.toastr.success(message);
          this.selectedUsers.clear();
          this.casheService.clearCache();
          this.isLoadingConfirm.update((v) => (v = false));
        } else {
          this.toastr.error(message);
          this.isLoadingConfirm.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingConfirm.update((v) => (v = false));
      },
    });
  }
  showConfirmDelete(id: string) {
    this.selectedItemId = id;
    this.showModal = true;
  }
  handleClose(confirmed: boolean) {
    if (confirmed && this.selectedItemId !== null) {
      const idsOfTrainees = this.filterData.map((t) => t.id);
      this.getOthers(idsOfTrainees);
    }
    this.showModal = false;
  }
  selectTab(tab: string) {
    this.activeTab = tab;
    if (this.activeTab !== 'tab1') {
      const idsOfTrainees = this.filterData.map((t) => t.id);
      this.getOthers(idsOfTrainees);
      this.casheService.clearCache();
    } else {
      this.getToFilter();
      this.casheService.clearCache();
    }
  }
}
