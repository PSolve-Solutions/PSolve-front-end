import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ContestsHocService } from '../../services/contests-hoc.service';
import { SessionsHOCService } from '../../services/sessions-hoc.service';
import { SheetsHOCService } from '../../services/sheets-hoc.service';
import { WeeklyFilterService } from '../../services/weekly-filter.service';

@Component({
  selector: 'app-confirm-delete-hoc',
  standalone: true,
  imports: [],
  templateUrl: './confirm-delete-hoc.component.html',
  styleUrl: './confirm-delete-hoc.component.scss',
})
export class ConfirmDeleteHocComponent {
  contestsHocService = inject(ContestsHocService);
  sessionsHOCService = inject(SessionsHOCService);
  sheetsHOCService = inject(SheetsHOCService);
  weeklyFilterService = inject(WeeklyFilterService);
  @Input() itemId: number | null | any = null;
  @Input() lable?: string = '';
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
      if (this.lable === 'contest') {
        this.deleteItem(this.itemId);
      } else if (this.lable === 'session') {
        this.deleteSession(this.itemId);
      } else if (this.lable === 'sheet') {
        this.deleteSheet(this.itemId);
      } else {
        this.deleteTraineeOthers(this.itemId);
      }
    }
  }

  deleteItem(id: number) {
    this.isLoading.set(true);
    this.contestsHocService.deleteContest(id).subscribe({
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
  deleteSession(id: number) {
    this.isLoading.set(true);
    this.sessionsHOCService.deleteSession(id).subscribe({
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

  deleteSheet(id: number) {
    this.isLoading.set(true);
    this.sheetsHOCService.deleteSheet(id).subscribe({
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

  deleteTraineeOthers(id: number) {
    this.isLoading.set(true);
    this.weeklyFilterService.filterTrainee(id).subscribe({
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
