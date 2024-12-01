import { Component, inject, OnInit } from '@angular/core';
import { ClientsService } from '../../services/clients.service';
import { TableAdminComponent } from '../../components/table-admin/table-admin.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [TableAdminComponent, RouterLink],
  templateUrl: './admin-clients.component.html',
  styleUrl: './admin-clients.component.scss',
})
export class AdminClientsComponent implements OnInit {
  clientsService = inject(ClientsService);
  isLoading: boolean = false;
  allClients!: any;
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
