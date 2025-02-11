import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableAdminComponent } from '../../components/table-admin/table-admin.component';
import { AdminsService } from '../../services/admins.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-university-admin',
  standalone: true,
  imports: [NgClass],
  templateUrl: './university-admin.component.html',
  styleUrl: './university-admin.component.scss',
})
export class UniversityAdminComponent {
  adminsService = inject(AdminsService);
  ocSidebarService = inject(OcSidebarService);
  toastr = inject(ToastrService);
  isLoading: boolean = false;
  isLoadingDelete: boolean = false;
  isLoadingAdd: boolean = false;
  isDeleted: boolean = false;
  showModalDelete: boolean = false;
  allUniversities: { name: string }[] = [];
  selectedUniversityName: string | null = null;
  constructor() {
    this.getAllUniversities();
  }
  getAllUniversities(): void {
    this.isLoading = true;
    this.adminsService.getUniversities().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allUniversities = data;
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
  addUniversity(universityNameInput: HTMLInputElement): void {
    const universityName = universityNameInput.value.trim();
    if (!universityName) return;
    this.isLoadingAdd = true;
    this.adminsService.addUniversity(universityName).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.allUniversities.push({ name: universityName });
          universityNameInput.value = '';
          this.toastr.success(message);
          this.isLoadingAdd = false;
        } else {
          this.isLoadingAdd = false;
          this.toastr.error(message);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingAdd = false;
      },
    });
  }
  showConfirmDelete(universityName: string) {
    this.selectedUniversityName = universityName;
    this.showModalDelete = true;
    this.isDeleted = false;
  }
  cancel() {
    this.selectedUniversityName = null;
    this.showModalDelete = false;
  }
  confirmDelete() {
    if (this.selectedUniversityName !== null) {
      this.isLoadingDelete = true;
      this.adminsService
        .deleteUniversity(this.selectedUniversityName)
        .subscribe({
          next: ({ statusCode, message }) => {
            if (statusCode === 200) {
              this.toastr.success(message);
              this.allUniversities = this.allUniversities.filter(
                (un) => un.name !== this.selectedUniversityName
              );
              this.selectedUniversityName = null;
              this.isLoadingDelete = false;
              this.isDeleted = true;
            } else {
              this.isLoadingDelete = false;
              this.isDeleted = false;
            }
          },
          error: (err) => {
            console.log(err);
            this.isLoadingDelete = false;
            this.isDeleted = false;
          },
        });
    }
  }
}
