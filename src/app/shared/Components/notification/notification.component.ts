import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
dayjs.extend(relativeTime);

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgClass],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  @Input() isOpen: boolean = true;
  @Input() newNotificationCheck!: () => void;
  notificationService = inject(NotificationService);
  router = inject(Router);
  baseUrlFront: string = environment.BASE_URL_FRONT;
  allNotification: any[] = [];
  notifications: any;
  currentPage: number = 1;
  pageSize: number = 10;
  isRead: boolean = true;
  isLoading: boolean = false;

  toggleIsRead(): void {
    this.isRead = !this.isRead;
    this.allNotification = [];
    this.currentPage = 1;
    this.getAllNotifications(this.currentPage, this.pageSize, this.isRead);
  }

  getAllNotifications(
    currentPage: number,
    pageSize: number,
    isRead: boolean
  ): void {
    this.isLoading = true;
    this.notificationService
      .getAllNotifications(currentPage, pageSize, isRead)
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.notifications = res;
            this.allNotification.push(this.notifications);
            this.isLoading = false;
          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  onScroll(event: any): void {
    const element = event.target;
    const bottomThreshold = 5;
    const atBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - bottomThreshold;
    if (atBottom && !this.isLoading && this.notifications?.hasNextPage) {
      this.getAllNotifications(++this.currentPage, this.pageSize, this.isRead);
    }
  }

  calculateTimeFromNow(date: string): string {
    const now = dayjs();
    const then = dayjs(date);
    const diffInHours = now.diff(then, 'hour');
    const diffInDays = now.diff(then, 'day');
    const diffInMonths = now.diff(then, 'month');

    if (diffInHours < 24) {
      return `${diffInHours} hrs`;
    } else if (diffInDays < 30) {
      return `${diffInDays} days`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} months`;
    } else {
      const diffInYears = now.diff(then, 'year');
      return `${diffInYears} years`;
    }
  }

  returnTheColor(type: number, isRead: boolean): string {
    switch (type) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 6: {
        return `bg-[#3D91C726] ${isRead ? 'bg-[#f1f7fb]' : ''}`;
      }
      // green
      case 8:
      case 10: {
        return 'bg-[#28A74526]';
      }
      //red
      case 7: {
        return `bg-[#DC354526] ${isRead ? 'bg-[#fdf0f1]' : ''}`;
      }
      // yellow
      case 4:
      case 5:
      case 9: {
        return 'bg-[#CCA82726]';
      }
    }
    return '#DC354526';
  }

  goToThePage(type: number): void {
    switch (type) {
      case 0:
        window.location.assign(`${this.baseUrlFront}/trainee/home`);
        break;
      case 1:
        window.location.assign(`${this.baseUrlFront}/trainee/sheets`);

        break;
      case 2:
        window.location.assign(`${this.baseUrlFront}/trainee/contests`);

        break;
      case 3:
        window.location.assign(`${this.baseUrlFront}/trainee/home`);

        break;
      case 4:
        window.location.assign(`${this.baseUrlFront}/mentor/tasks`);

        break;
      case 10:
        window.location.assign(`${this.baseUrlFront}/mentor/tracking`);
        break;
    }
  }
  markasRead(id: number, type: number, isRead: boolean) {
    this.goToThePage(type);
    if (!isRead) {
      this.notificationService.markasRead(id).subscribe({
        next: ({ statusCode }) => {
          if (statusCode === 200) {
            this.newNotificationCheck();
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
