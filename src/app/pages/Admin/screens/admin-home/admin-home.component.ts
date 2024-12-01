import { Component, inject, OnInit, signal } from '@angular/core';
import { TableAdminComponent } from '../../components/table-admin/table-admin.component';
import { AdminsService } from '../../services/admins.service';
import { Admins, Data } from '../../model/admins';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [TableAdminComponent, RouterLink],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent implements OnInit {
  adminsService = inject(AdminsService);
  isLoading: boolean = false;
  allAdmins!: Admins;
  ngOnInit() {
    this.getAllAdminsPagination(1, 10);
  }

  getPageParams(pageParams: {
    currentPage: number;
    rowsPerPage: number;
  }): void {
    this.getAllAdminsPagination(pageParams.currentPage, pageParams.rowsPerPage);
  }

  getAllAdminsPagination(currentPage: number, pageSize: number): void {
    this.isLoading = true;
    this.adminsService.getAllAdminsPagination(currentPage, pageSize).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.allAdmins = res;
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
}
