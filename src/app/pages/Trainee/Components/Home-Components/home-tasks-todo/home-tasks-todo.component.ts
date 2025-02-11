import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { HomeService } from '../../../Services/home.service';
import { task } from '../../../model/trinee-home';
import { DatePipe, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-home-tasks-todo',
  standalone: true,
  imports: [NgClass, DatePipe],
  templateUrl: './home-tasks-todo.component.html',
  styleUrls: ['./home-tasks-todo.component.scss'],
})
export class HomeTasksToDoComponent implements OnInit {
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
  todoTasks: task[] = [];
  ngOnInit(): void {
    this._homeService.loadTasks();
    this.loadToDoTasks();
  }

  openToDoTasks(): void {
    this.isOpenTasks.set(!this.isOpenTasks());
  }
  openList(id: string): void {
    this.isOpenList.set(!this.isOpenList());
    this.taskId = id;
  }
  loadToDoTasks(): void {
    this._homeService.toDo.subscribe({
      next: (response) => {
        this.todoTasks = response;
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
