import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { RequestsLeaderService } from '../../services/requests-leader.service';

@Component({
  selector: 'app-confirm-delete-request',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete-request.component.html',
  styleUrl: './confirm-delete-request.component.scss',
})
export class ConfirmDeleteRequestComponent {
  @Input() selectedIds: number[] | null = null;
  @Output() closeModal = new EventEmitter<boolean>();
  requestsLeaderService = inject(RequestsLeaderService);
  isLoading = signal<boolean>(false);
  isDeleted: boolean = false;

  cancel() {
    if (!this.isLoading() && !this.isDeleted) {
      this.closeModal.emit(false);
    }
    if (!this.isLoading() && this.isDeleted) {
      this.closeModal.emit(true);
    }
  }
  confirm() {
    if (this.selectedIds?.length !== 0) {
      this.deleteItem(this.selectedIds);
    }
  }

  deleteItem(ids: any) {
    this.isLoading.set(true);
    this.requestsLeaderService.deleteRequests(ids).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          this.isLoading.update((v) => (v = false));
          this.isDeleted = true;
        } else {
          this.isDeleted = false;
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isDeleted = false;
        this.isLoading.update((v) => (v = false));
      },
    });
  }
}
