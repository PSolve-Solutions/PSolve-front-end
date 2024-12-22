import { Component, inject, OnInit, signal } from '@angular/core';
import { SessionsHOCService } from '../../services/sessions-hoc.service';
import { CasheService } from '../../../../shared/services/cashe.service';
import { Router } from '@angular/router';
import { Sessions } from '../../model/sessions';
import { ConfirmDeleteHocComponent } from '../../components/confirm-delete-hoc/confirm-delete-hoc.component';
import { DatePipe, NgClass } from '@angular/common';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-sessions-hoc',
  standalone: true,
  imports: [ConfirmDeleteHocComponent, DatePipe, NgClass],
  templateUrl: './sessions-hoc.component.html',
  styleUrl: './sessions-hoc.component.scss',
})
export class SessionsHOCComponent implements OnInit {
  sessionsHOCService = inject(SessionsHOCService);
  casheService = inject(CasheService);
  ocSidebarService = inject(OcSidebarService);
  router = inject(Router);
  allSessions!: Sessions;
  currentPage: number = 1;
  pageSize: number = 10;
  keyword: string = '';
  isLoading = signal<boolean>(false);
  showModal: boolean = false;
  selectedItemId: number | null = null;
  dataRequest: Sessions[] = [];
  sessionId: number | null = null;

  ngOnInit() {
    this.getAllSessions(this.currentPage, this.pageSize);
  }

  convertToLocal(date: string): Date {
    const localDate = new Date(date);
    return localDate;
  }

  getAllSessions(currentPage: number, pageSize: number): void {
    this.isLoading.set(true);
    this.sessionsHOCService.getAllSessions(currentPage, pageSize).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.allSessions = res;
          this.dataRequest.push(this.allSessions);
          this.isLoading.update((v) => (v = false));
        } else {
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading.update((v) => (v = false));
      },
    });
  }

  toggleDetails(id: number) {
    if (id === this.sessionId) {
      this.sessionId = 0;
    } else {
      this.sessionId = id;
    }
  }

  showConfirmDelete(id: number) {
    this.selectedItemId = id;
    this.showModal = true;
  }

  handleClose(confirmed: boolean) {
    if (confirmed && this.selectedItemId !== null) {
      this.dataRequest = [];
      this.casheService.clearCache();
      this.getAllSessions(this.allSessions?.currentPage, this.pageSize);
    }
    this.showModal = false;
  }

  goToActionSession(id: number): void {
    this.router.navigate(['head_of_camp/sessions/action-session/', id]);
  }

  loadMoreData(event: any): void {
    const element = event.target;
    const bottomThreshold = 5;
    const atBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - bottomThreshold;
    if (atBottom && !this.isLoading() && this.allSessions?.hasNextPage) {
      this.getAllSessions(++this.currentPage, this.pageSize);
    }
  }
}
