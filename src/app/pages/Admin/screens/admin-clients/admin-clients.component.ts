import { Component, inject, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { TableAdminComponent } from '../../components/table-admin/table-admin.component';
import { RouterLink } from '@angular/router';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { NgClass } from '@angular/common';
import { Clinets } from '../../model/clients';
import { ToastrService } from 'ngx-toastr';
import { CasheService } from '../../../../shared/services/cashe.service';
@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [TableAdminComponent, RouterLink, NgClass],
  templateUrl: './admin-clients.component.html',
  styleUrl: './admin-clients.component.scss',
})
export class AdminClientsComponent implements OnInit {
  clientsService = inject(ClientsService);
  ocSidebarService = inject(OcSidebarService);
  toastr = inject(ToastrService);
  casheService = inject(CasheService);
  isLoading: boolean = false;
  allClients!: Clinets;
  currentPage: number = 1;
  rowsPerPage: number = 5;
  ngOnInit() {
    this.getAllClientsPagination(1, 5);
  }
  getPageParams(pageParams: {
    currentPage: number;
    rowsPerPage: number;
  }): void {
    this.currentPage = pageParams.currentPage;
    this.rowsPerPage = pageParams.rowsPerPage;
    this.getAllClientsPagination(
      pageParams.currentPage,
      pageParams.rowsPerPage
    );
  }
  getClientId(clientId: string): void {
    this.clientsService.changeLockStatus(clientId).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.casheService.clearCache();
          this.getAllClientsPagination(this.currentPage, this.rowsPerPage);
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
  getAllClientsPagination(currentPage: number, pageSize: number): void {
    this.isLoading = true;
    this.clientsService
      .getAllClientsPagination(currentPage, pageSize)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.allClients = res;
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
