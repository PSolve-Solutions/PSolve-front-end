import { Component, inject, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { dashboardFeedbacks } from '../../model/dashboard';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [NgClass],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.scss',
})
export class TestimonialComponent {
  @Input() inReport: boolean = false;
  @Input() dashboardFeedbacks: dashboardFeedbacks[] = [];
  dashboardService = inject(DashboardService);
  currentPage: number = 0;
  prevTestimonial(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }
  nextTestimonial(): void {
    if (this.currentPage < this.dashboardFeedbacks.length - 1) {
      this.currentPage++;
    }
  }
  getStarsArray(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return [
      ...Array(fullStars).fill('filled'),
      ...Array(halfStar ? 1 : 0).fill('half'),
      ...Array(emptyStars).fill('empty'),
    ];
  }
}
