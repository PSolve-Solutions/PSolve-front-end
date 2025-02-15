import { Component, HostListener, inject, signal } from '@angular/core';
import { HomeService } from '../../../Services/home.service';
import { task } from '../../../model/trinee-home';
import { DatePipe, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-tasks-done',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './home-tasks-done.component.html',
  styleUrl: './home-tasks-done.component.scss',
})
export class HomeTasksDoneComponent {
  _homeService = inject(HomeService);
  doneTasks: task[] = [];
  toastr = inject(ToastrService);
  isOpenTasks = signal<boolean>(false);
  isOpenList = signal<boolean>(false);
  taskId: string = '';
  taskStatus: { id: number; name: string }[] = [
    { id: 0, name: 'To Do' },
    { id: 1, name: 'In Progress' },
    { id: 2, name: 'Done' },
  ];

  ngOnInit(): void {
    this.loadDoneTasks();
  }

  openToDoTasks(): void {
    this.isOpenTasks.set(!this.isOpenTasks());
  }
  openList(id: string): void {
    this.taskId = id;
    this.isOpenList.set(!this.isOpenList());
  }

  loadDoneTasks(): void {
    this._homeService.done.subscribe({
      next: (response) => {
        this.doneTasks = response;
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
