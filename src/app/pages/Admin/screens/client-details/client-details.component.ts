import { Component, inject } from '@angular/core';
import { OneClient } from '../../model/clients';
import { ClientsService } from '../../services/clients.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss',
})
export class ClientDetailsComponent {
  clientsService = inject(ClientsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);
  isLoading: boolean = false;
  isLoadingSubmit: boolean = false;
  client!: OneClient;
  clientId: string = '';
  startDate: string = '';
  endDate: string = '';
  logoImage: string = '';
  constructor() {
    this.route.params.subscribe((param) => {
      this.clientId = param['id'];
      this.getClientById(this.clientId);
    });
  }
  getClientById(id: string): void {
    this.isLoading = true;
    this.clientsService.getClientById(id).subscribe({
      next: ({ data, statusCode }) => {
        if (statusCode === 200) {
          this.client = data;
          this.startDate = this.client.startDate;
          this.endDate = this.client.endDate;
          this.logoImage = this.client.logoUrl;
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
  updatesubScribtionClient(startDate: string, endDate: string) {
    this.isLoadingSubmit = true;
    const info = {
      clientId: this.clientId,
      startDate,
      endDate,
    };
    this.clientsService.updateSubscribtion(info).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.isLoadingSubmit = false;
          this.router.navigate(['/psovle/clients']);
        } else if (statusCode === 400) {
          this.toastr.error(message);
          this.isLoadingSubmit = false;
        } else if (statusCode === 500) {
          this.toastr.warning(message);
          this.isLoadingSubmit = false;
        } else {
          errors.forEach((error: any) => {
            this.toastr.error(error);
          });
          this.isLoadingSubmit = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
