import { Component, inject, OnInit, signal } from '@angular/core';
import { ContestsHocService } from '../../services/contests-hoc.service';
import { Contests } from '../../model/contests';
import { Router } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { ConfirmDeleteHocComponent } from '../../components/confirm-delete-hoc/confirm-delete-hoc.component';
import { CasheService } from '../../../../shared/services/cashe.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-contests-hoc',
  standalone: true,
  imports: [DatePipe, ConfirmDeleteHocComponent, NgClass],
  templateUrl: './contests-hoc.component.html',
  styleUrl: './contests-hoc.component.scss',
})
export class ContestsHOCComponent implements OnInit {
  contestsHocService = inject(ContestsHocService);
  ocSidebarService = inject(OcSidebarService);
  casheService = inject(CasheService);
  router = inject(Router);
  allContests!: Contests;
  currentPage: number = 1;
  pageSize: number = 10;
  isLoading = signal<boolean>(false);
  showModal: boolean = false;
  selectedItemId: number | null = null;
  dataRequest: any[] = [];

  ngOnInit() {
    this.getAllContests(this.currentPage, this.pageSize);
  }

  convertToLocal(date: string): string {
    const localDate = new Date(date);
    return localDate.toLocaleString('en-US', { hour12: false });
  }

  getAllContests(currentPage: number, pageSize: number): void {
    this.isLoading.set(true);
    this.contestsHocService.getAllContests(currentPage, pageSize).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.allContests = res;
          this.dataRequest.push(this.allContests);
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

  showConfirmDelete(id: number) {
    this.selectedItemId = id;
    this.showModal = true;
  }

  handleClose(confirmed: boolean) {
    if (confirmed && this.selectedItemId !== null) {
      this.dataRequest = [];
      this.casheService.clearCache();
      this.getAllContests(this.allContests?.currentPage, 10);
    }
    this.showModal = false;
  }

  goToActionContest(id: number): void {
    this.router.navigate(['head_of_camp/contests/action-contest/', id]);
  }

  loadMoreData(event: any): void {
    const element = event.target;
    const atBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 4;
    if (atBottom && !this.isLoading() && this.allContests?.hasNextPage) {
      this.getAllContests(++this.currentPage, this.pageSize);
    }
  }
}
