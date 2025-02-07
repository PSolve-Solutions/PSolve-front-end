import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { AdminsService } from '../../services/admins.service';
import { ClientsService } from '../../services/clients.service';
@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss',
})
export class DeleteUserComponent {
  adminService = inject(AdminsService);
  clientsService = inject(ClientsService);
  @Input() lable?: string = '';
  @Input() itemId: string | null | any = null;
  @Output() closeModal = new EventEmitter<boolean>();
  isLoading = signal<boolean>(false);
  isDeleted = signal<boolean>(false);
  cancel() {
    if (!this.isLoading() && !this.isDeleted()) {
      this.closeModal.emit(false);
    }
    if (!this.isLoading() && this.isDeleted()) {
      this.closeModal.emit(true);
    }
  }
  confirm() {
    if (this.itemId !== null) {
      if (this.lable === 'admin') {
        this.deleteAdmin(this.itemId);
      } else {
        this.deleteClient(this.itemId);
      }
    }
  }
  deleteAdmin(id: string) {
    this.isLoading.set(true);
    this.adminService.deleteAdmin(id).subscribe({
      next: ({ message, statusCode }) => {
        if (statusCode === 200) {
          this.isLoading.update((v) => (v = false));
          this.isDeleted.set(true);
        } else {
          this.isDeleted.set(false);
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isDeleted.set(false);
        this.isLoading.update((v) => (v = false));
      },
    });
  }
  deleteClient(id: string) {
    this.isLoading.set(true);
    this.clientsService.deleteClient(id).subscribe({
      next: ({ message, statusCode }) => {
        if (statusCode === 200) {
          this.isLoading.update((v) => (v = false));
          this.isDeleted.set(true);
        } else {
          this.isDeleted.set(false);
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isDeleted.set(false);
        this.isLoading.update((v) => (v = false));
      },
    });
  }
}
