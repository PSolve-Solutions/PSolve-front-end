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

@Component({
  selector: 'app-home-tasks-in-progress',
  standalone: true,
  templateUrl: './home-tasks-in-progress.component.html',
  styleUrl: './home-tasks-in-progress.component.scss',
  animations: [
    trigger('slideToggle', [
      state(
        'hidden',
        style({
          height: '0px',
          opacity: 0,
          overflow: 'hidden',
          display: 'none',
        })
      ),
      state('visible', style({ height: '*', opacity: 1, display: '*' })),
      transition('hidden <=> visible', animate('500ms ease-in-out')),
    ]),
    trigger('fadeToggle', [
      state(
        'open',
        style({ opacity: 1, transform: 'scaleY(1)', display: 'block' })
      ),
      state(
        'closed',
        style({ opacity: 0, transform: 'scaleY(0)', display: 'none' })
      ),
      transition('open <=> closed', [
        animate(
          '300ms ease-in-out',
          style({ transform: 'scaleY(0)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('rotateArrow', [
      state('rotated', style({ transform: 'rotate(-90deg)' })),
      state('default', style({ transform: 'rotate(0deg)' })),
      transition('default <=> rotated', animate('300ms ease-in-out')),
    ]),
  ],
})
export class HomeTasksInProgressComponent {
  private _homeService = inject(HomeService);
  inProgressTasks: task[] = [];
  arrowState = 'rotated'; // To control the arrow rotation state
  tableVisible = true;
  listVisibility: { [taskId: string]: boolean } = {}; // Object to track task list visibility

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadInProgressTasks();
  }

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
