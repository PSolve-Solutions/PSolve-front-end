import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CampLeaderService } from '../../services/camp-leader.service';

@Component({
  selector: 'app-confirm-camp',
  standalone: true,
  imports: [],
  templateUrl: './confirm-camp.component.html',
  styleUrl: './confirm-camp.component.scss',
})
export class ConfirmCampComponent {
  campLeaderService = inject(CampLeaderService);
  @Input() itemId: number | null = null;
  @Output() closeModal = new EventEmitter<boolean>();
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
    if (this.itemId !== null) {
      this.deleteItem(this.itemId);
    }
  }
  deleteItem(id: number) {
    this.isLoading.set(true);
    this.campLeaderService.deleteCamp(id).subscribe({
      next: ({ message, statusCode }) => {
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
