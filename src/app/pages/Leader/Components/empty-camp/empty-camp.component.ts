import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CampLeaderService } from '../../services/camp-leader.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empty-camp',
  standalone: true,
  imports: [],
  templateUrl: './empty-camp.component.html',
  styleUrl: './empty-camp.component.scss',
})
export class EmptyCampComponent {
  campLeaderService = inject(CampLeaderService);
  toastr = inject(ToastrService);
  @Input() itemId: number | null = null;
  @Output() closeEmptyModal = new EventEmitter<boolean>();
  isLoading = signal<boolean>(false);
  isEmpty: boolean = false;

  cancel() {
    this.closeEmptyModal.emit(false);
  }
  confirm() {
    if (this.itemId !== null) {
      this.emptyItem(this.itemId);
    }
  }
  emptyItem(id: number) {
    this.isLoading.set(true);
    this.campLeaderService.emptyCamp(id).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.isLoading.update((v) => (v = false));
          this.isEmpty = true;
          this.toastr.success(message);
        } else {
          this.isEmpty = false;
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isEmpty = false;
        this.isLoading.update((v) => (v = false));
      },
    });
  }
}
