import { Component, inject, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { TableAdminComponent } from '../../components/table-admin/table-admin.component';
import { RouterLink } from '@angular/router';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { NgClass } from '@angular/common';
import { Clinets } from '../../model/clients';

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
  isLoading: boolean = false;
  allClients!: Clinets;
  ngOnInit() {
    this.getAllClientsPagination(1, 5);
  }

  getPageParams(pageParams: {
    currentPage: number;
    rowsPerPage: number;
  }): void {
    this.getAllClientsPagination(
      pageParams.currentPage,
      pageParams.rowsPerPage
    );
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
