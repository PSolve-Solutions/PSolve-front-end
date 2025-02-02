import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { RequestsLeaderService } from '../../../pages/Leader/services/requests-leader.service';
import { ToastrService } from 'ngx-toastr';
import { CampLeaderService } from '../../../pages/Leader/services/camp-leader.service';
@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrl: './delete-confirm-modal.component.scss',
})
export class DeleteConfirmModalComponent {
  request = inject(RequestsLeaderService);
  camps = inject(CampLeaderService);
  toastr = inject(ToastrService);
  @Input() label: string = '';
  @Input() itemId: string | null | any = null;
  @Input() selectedIds?: number[] | any = null;
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
    if (this.selectedIds !== null && this.label === 'request') {
      this.deleteRequests(this.selectedIds);
    }
    if (this.itemId !== null) {
      if (this.label === 'camps') {
        this.deleteCamp(this.itemId);
      }
    }
  }
  deleteRequests(id: any) {
    this.isLoading.set(true);
    this.request.deleteRequests(id).subscribe({
      next: ({ message, statusCode }) => {
        if (statusCode === 200) {
          this.isLoading.update((v) => (v = false));
          this.isDeleted.set(true);
          this.toastr.success(message);
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
  deleteCamp(id: any) {
    this.isLoading.set(true);
    this.camps.deleteCamp(id).subscribe({
      next: ({ message, statusCode }) => {
        if (statusCode === 200) {
          this.isLoading.update((v) => (v = false));
          this.isDeleted.set(true);
          this.toastr.success(message);
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
