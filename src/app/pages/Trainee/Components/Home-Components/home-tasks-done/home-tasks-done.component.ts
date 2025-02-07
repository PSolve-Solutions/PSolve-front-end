import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { HomeService } from '../../../Services/home.service';
import { task } from '../../../model/trinee-home';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
declare var $: any;
@Component({
  selector: 'app-home-tasks-done',
  standalone: true,
  imports: [],
  templateUrl: './home-tasks-done.component.html',
  styleUrl: './home-tasks-done.component.scss',
})
export class HomeTasksDoneComponent {
  // Inject HomeService to handle task-related operations
  private _homeService = inject(HomeService);
  doneTasks: task[] = [];
  // Lifecycle hook to load tasks when the component initializes
  ngOnInit(): void {
    this.loadDoneTasks();
  }
  // Load tasks from the server and categorize them based on their status
  loadDoneTasks(): void {
    this._homeService.done.subscribe({
      next: (response) => {
        this.doneTasks = response;
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
    this.listVisibility[task.id] = !this.listVisibility[task.id];
  }
  // Toggle the visibility of the task tables
  toggleTables(): void {
    this.tableVisible = !this.tableVisible;
    this.arrowState = this.tableVisible ? 'rotated' : 'default';
  }
  // Toggle the visibility of task lists within each category
  toggleList(id: string): void {
    $(`#${id}`).slideToggle(300);
  }
}
