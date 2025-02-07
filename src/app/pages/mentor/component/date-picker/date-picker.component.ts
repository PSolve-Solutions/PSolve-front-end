import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
@Component({
  selector: 'app-date-picker',
  standalone: true,
  template: `
    <div class="relative">
      <input
        #datepickerInput
        type="text"
        placeholder="Select Date"
        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 cursor-pointer"
        readonly
        (click)="toggleCalendar()"
      />
      <div
        #calendar
        class="absolute left-0 mt-2 p-4 bg-white border border-gray-200 rounded-md shadow-lg hidden z-10"
      >
        <div class="flex justify-between items-center mb-2">
          <button (click)="changeMonth(-1)" class="focus:outline-none">
            &lt;
          </button>
          <span class="text-gray-700 font-semibold">{{ monthYear }}</span>
          <button (click)="changeMonth(1)" class="focus:outline-none">
            &gt;
          </button>
        </div>
        <div class="grid grid-cols-7 text-center text-sm text-gray-500">
          <div *ngFor="let day of daysOfWeek">{{ day }}</div>
        </div>
        <div class="grid grid-cols-7 text-center text-sm mt-2">
          <ng-container *ngFor="let day of days">
            <div
              class="p-1 cursor-pointer rounded hover:bg-gray-200"
              (click)="selectDate(day)"
            >
              {{ day }}
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule],
  styles: [],
})
export class DatePickerComponent {
  @ViewChild('datepickerInput', { static: true }) datepickerInput!: ElementRef;
  @ViewChild('calendar', { static: true }) calendar!: ElementRef;
  currentDate = new Date();
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days: number[] = [];
  monthYear: string = '';
  ngOnInit() {
    this.renderCalendar(this.currentDate);
  }
  toggleCalendar() {
    this.calendar.nativeElement.classList.toggle('hidden');
  }
  changeMonth(monthChange: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + monthChange);
    this.renderCalendar(this.currentDate);
  }
  selectDate(day: number) {
    const selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    this.datepickerInput.nativeElement.value =
      selectedDate.toLocaleDateString('en-US');
    this.calendar.nativeElement.classList.add('hidden');
  }
  renderCalendar(date: Date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    this.days = [];
    this.monthYear = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    for (let i = 0; i < firstDay; i++) {
      this.days.push(0); // Empty days for padding
    }
    for (let i = 1; i <= lastDate; i++) {
      this.days.push(i);
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      !this.datepickerInput.nativeElement.contains(event.target) &&
      !this.calendar.nativeElement.contains(event.target)
    ) {
      this.calendar.nativeElement.classList.add('hidden');
    }
  }
}
