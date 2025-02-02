import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '../../../Services/home.service';
import { task } from '../../../model/trinee-home';
declare var $: any;
@Component({
  selector: 'app-home-tasks-todo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-tasks-todo.component.html',
  styleUrls: ['./home-tasks-todo.component.scss'],
})
export class HomeTasksToDoComponent implements OnInit {
  // Inject HomeService to handle task-related operations
  private _homeService = inject(HomeService);
  // Arrays to hold tasks based on their status
  todoTasks: task[] = [];
  // Lifecycle hook to load tasks when the component initializes
  ngOnInit(): void {
    this._homeService.loadTasks();
    this.loadToDoTasks();
  }
  // Load tasks from the server and categorize them based on their status
  loadToDoTasks(): void {
    this._homeService.toDo.subscribe({
      next: (response) => {
        this.todoTasks = response;
      },
    });
  }
  // Change the status of a task and reload the tasks
  changeTaskStatus(task: task, status: number): void {
    const model = {
      taskId: task.id,
      status: status,
    };
    this._homeService.UpdateTraineeTask(model).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          this._homeService.loadTasks();
        }
      },
    });
    // Hide the task list after updating the status
    $(`#${task.id}`).slideToggle(300);
  }
  // Toggle the visibility of the task tables
  toggleTables(): void {
    $('.todo-table').slideToggle(500);
    $('.todo-arrow').toggleClass('rotate');
  }
  // Toggle the visibility of task lists within each category
  toggleList(id: string): void {
    $(`#${id}`).slideToggle(300);
  }
}
