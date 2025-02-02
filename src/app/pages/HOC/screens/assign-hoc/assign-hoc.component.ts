import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { AssignHocService } from '../../services/assign-hoc.service';
import { Mentor, Trainee } from '../../model/assign-hoc';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-assign-hoc',
  standalone: true,
  imports: [NgSelectModule, NgClass],
  templateUrl: './assign-hoc.component.html',
  styleUrl: './assign-hoc.component.scss',
})
export class AssignHOCComponent implements OnInit {
  assignHocService = inject(AssignHocService);
  ocSidebarService = inject(OcSidebarService);
  toastr = inject(ToastrService);
  allTrainees: Trainee[] = [];
  allMentor: Mentor[] = [];
  selectedMentor: Mentor | null = null;
  selectedTraineeId: string = '';
  isLoading = signal<boolean>(false);
  isLoading2 = signal<boolean>(false);
  keywordSearch: string = '';
  sortbyNum: number = 0 | 1 | 2;
  focusOrder: boolean = false;
  isSelectedMentor: boolean = false;
  isHover: boolean = false;
  tranieeId: string = '';
  ngOnInit() {
    this.getAllAssignMentors();
    this.getAllAssignTrainees(this.sortbyNum, this.keywordSearch);
  }
  handleSelectMentor(mentor: any): void {
    this.selectedMentor = mentor;
  }
  getAllAssignTrainees(SortBy?: number, KeyWord?: string): void {
    this.isLoading.set(true);
    this.assignHocService.getAllAssignTrainees(SortBy, KeyWord).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allTrainees = data;
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
  getAllAssignMentors(): void {
    this.isLoading2.set(true);
    this.assignHocService.getAllAssignMentors().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allMentor = data;
          this.isLoading2.update((v) => (v = false));
        } else {
          this.isLoading2.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading2.update((v) => (v = false));
      },
    });
  }
  addToMentor(trainee: Trainee) {
    const data = {
      traineeId: trainee.id,
      mentorId: this.selectedMentor?.id,
    };
    if (this.selectedMentor) {
      this.assignHocService.assignTraniee(data).subscribe({
        next: ({ statusCode, message }) => {
          if (statusCode === 200) {
            this.selectedMentor?.trainees.push(trainee);
            this.allTrainees = this.allTrainees.filter(
              (p) => p.id !== trainee.id
            );
            this.toastr.success(message);
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
  }
  removeFromMentor(trainee: Trainee, mentor: Mentor): void {
    this.assignHocService.unAssignTrainee(trainee.id).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          mentor.trainees = mentor.trainees.filter((t) => t.id !== trainee.id);
          this.allTrainees.push(trainee);
          this.toastr.success(message);
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
  sortTrainee(item: number) {
    this.sortbyNum = item;
    this.getAllAssignTrainees(this.sortbyNum, this.keywordSearch);
  }
  onSearchInput(event: any): void {
    this.keywordSearch = event.target.value;
    this.getAllAssignTrainees(this.sortbyNum, this.keywordSearch);
  }
  handleHoverShow(tranieeId: string): void {
    this.isHover = true;
    this.tranieeId = tranieeId;
  }
  handleHoverHide(): void {
    this.isHover = false;
    this.tranieeId = '';
  }
}
