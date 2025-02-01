import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { HomeService } from '../../../Services/home.service';
import { task } from '../../../model/trinee-home';
import { animate, state, style, transition, trigger } from '@angular/animations';
declare var $: any;

@Component({
  selector: 'app-home-tasks-done',
  standalone: true,
  imports: [],
  templateUrl: './home-tasks-done.component.html',
  styleUrl: './home-tasks-done.component.scss',
  animations: [
      // Existing slideToggle animation
      trigger('slideToggle', [
        state('hidden', style({ height: '0px', opacity: 0, overflow: 'hidden', display: 'none' })),
        state('visible', style({ height: '*', opacity: 1, display: '*' })),
        transition('hidden <=> visible', animate('500ms ease-in-out'))
      ]),
      // Add fadeToggle animation
      trigger('fadeToggle', [
        state('open', style({ opacity: 1, transform: 'scaleY(1)', display: 'block' })),
        state('closed', style({ opacity: 0, transform: 'scaleY(0)', display: 'none' })),
        transition('open <=> closed', [
          animate('300ms ease-in-out', style({ transform: 'scaleY(0)', opacity: 0 })),
        ]),
      ]),
      trigger('rotateArrow', [
        state('rotated', style({ transform: 'rotate(-90deg)' })),
        state('default', style({ transform: 'rotate(0deg)' })),
        transition('default <=> rotated', animate('300ms ease-in-out')),
      ]),
    ]
})
export class HomeTasksDoneComponent {
   // Inject HomeService to handle task-related operations
   private _homeService = inject(HomeService);
   doneTasks: task[] = [];
   tableVisible = false;
   arrowState = 'defult'; // To control the arrow rotation state
   listVisibility: { [taskId: string]: boolean } = {};


     constructor(private elementRef: ElementRef){}
    // Lifecycle hook to load tasks when the component initializes
  ngOnInit(): void {
    this.loadDoneTasks();
  }

  // Load tasks from the server and categorize them based on their status
  loadDoneTasks(): void {
    this._homeService.done.subscribe({
      next: (response) => {
          this.doneTasks = response
      }
    });
  }
  // Change the status of a task and reload the tasks
  changeTaskStatus(task: task, status: number): void {
    const model = {
      taskId: task.id,
      status: status
    };

    this._homeService.UpdateTraineeTask(model).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          this._homeService.loadTasks();
        }
      }
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
  toggleList(taskId: string): void {
      if (this.listVisibility[taskId]) {
        this.listVisibility = {};
      } else {
        this.listVisibility = {};

        this.listVisibility[taskId] = true;
      }
    }
    @HostListener('document:click', ['$event'])
      onClickOutside(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
          // Close all lists
          for (let taskId in this.listVisibility) {
            this.listVisibility[taskId] = false;
          }
        }
      }

}
