import { Component, HostListener, inject, signal } from '@angular/core';
import { HomeService } from '../../../Services/home.service';
import { task } from '../../../model/trinee-home';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-home-tasks-in-progress',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './home-tasks-in-progress.component.html',
  styleUrl: './home-tasks-in-progress.component.scss',
})
export class HomeTasksInProgressComponent {
  _homeService = inject(HomeService);
  toastr = inject(ToastrService);
  isOpenTasks = signal<boolean>(true);
  isOpenList = signal<boolean>(false);
  taskId: string = '';
  taskStatus: { id: number; name: string }[] = [
    { id: 0, name: 'To Do' },
    { id: 1, name: 'In Progress' },
    { id: 2, name: 'Done' },
  ];
  inProgressTasks: task[] = [];
  ngOnInit(): void {
    this.loadInProgressTasks();
  }

  openToDoTasks(): void {
    this.isOpenTasks.set(!this.isOpenTasks());
  }
  openList(id: string): void {
    this.isOpenList.set(!this.isOpenList());
    this.taskId = id;
  }

  loadInProgressTasks(): void {
    this._homeService.inProgress.subscribe({
      next: (response) => {
        this.inProgressTasks = response;
      },
    });
  }

  changeTaskStatus(taskId: string, status: number): void {
    const model = {
      taskId: taskId,
      status: status,
    };
    this._homeService.UpdateTraineeTask(model).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this._homeService.loadTasks();
          this.isOpenList.set(false);
        } else {
          this.toastr.error(message);
        }
      },
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isInsideDropdown = targetElement.closest('#open');
    if (!isInsideDropdown) {
      this.isOpenList.set(false);
    }
  }
}
