import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { HomeService } from '../../../Services/home.service';
import { task } from '../../../model/trinee-home';
declare var $: any;
@Component({
  selector: 'app-home-tasks-in-progress',
  standalone: true,
  templateUrl: './home-tasks-in-progress.component.html',
  styleUrl: './home-tasks-in-progress.component.scss',
})
export class HomeTasksInProgressComponent {
  private _homeService = inject(HomeService);
  inProgressTasks: task[] = [];
  // Lifecycle hook to load tasks when the component initializes
  ngOnInit(): void {
    this.loadInProgressTasks();
  }
  // Load tasks from the server and categorize them based on their status
  loadInProgressTasks(): void {
    this._homeService.inProgress.subscribe({
      next: (response) => {
        this.inProgressTasks = response;
      },
    });
  }

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

  toggleList(taskId: string): void {
    if (this.listVisibility[taskId]) {
      this.listVisibility = {};
    } else {
      this.listVisibility = {};

      this.listVisibility[taskId] = true;
    }
  }

  // Close all lists if a click occurs outside the component
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Close all lists
      for (let taskId in this.listVisibility) {
        this.listVisibility[taskId] = false;
      }
    }
  }

  // Track task by ID to improve rendering performance
  trackTask(index: number, task: task): string {
    return task.id;
  }
}
