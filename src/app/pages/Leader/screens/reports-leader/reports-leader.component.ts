import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { BarchartReportsComponent } from '../../Components/barchart-reports/barchart-reports.component';
import { LineChartComponent } from '../../Components/line-chart/line-chart.component';
import { NgClass } from '@angular/common';
import { AboveReportComponent } from '../../Components/above-report/above-report.component';
import { ReportsService } from '../../services/reports.service';
import { TestimonialComponent } from '../../Components/testimonial/testimonial.component';
import { CasheService } from '../../../../shared/services/cashe.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
@Component({
  selector: 'app-reports-leader',
  standalone: true,
  imports: [
    BarchartReportsComponent,
    LineChartComponent,
    AboveReportComponent,
    NgClass,
    TestimonialComponent,
  ],
  templateUrl: './reports-leader.component.html',
  styleUrl: './reports-leader.component.scss',
})
export class ReportsLeaderComponent implements OnInit {
  reportsService = inject(ReportsService);
  casheService = inject(CasheService);
  ocSidebarService = inject(OcSidebarService);
  baseDataReport: any;
  reportInfo: { [key: number]: any } = {};
  expandedItems: Set<number> = new Set();
  isLoading = signal<boolean>(false);
  isLoadingReportInfo = signal<boolean>(false);
  // loading: boolean = false;
  endOfData: boolean = false;
  page: number = 1;
  dataReport: any[] = [];
  @ViewChildren('topSection') topSections!: QueryList<ElementRef>;
  ngOnInit() {
    this.reportsWithPagination(this.page, 2);
  }
  reportsWithPagination(
    currentPage: number,
    pageSize: number,
    KeyWord?: string
  ): void {
    this.isLoading.set(true);
    this.reportsService.reportsWithPagination(currentPage, pageSize).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.baseDataReport = res;
          this.dataReport.push(this.baseDataReport);
          this.isLoading.update((v) => (v = false));
        } else {
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading.update((v) => (v = false));
      },
    });
  }
  reportsInDetails(campId: number): void {
    this.isLoadingReportInfo.set(true);
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getMonth() + 1).padStart(
      2,
      '0'
    )}/${String(currentDate.getDate()).padStart(
      2,
      '0'
    )}/${currentDate.getFullYear()}`;
    this.reportsService.reportsInDetails(campId, formattedDate).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.reportInfo[campId] = data;
          this.isLoadingReportInfo.update((v) => (v = false));
        } else {
          this.isLoadingReportInfo.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingReportInfo.update((v) => (v = false));
      },
    });
  }
  toggleExpand(itemId: number, index: number): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
      this.reportsInDetails(itemId);
      this.scrollToTopSectionById(itemId);
    }
  }
  isExpanded(itemId: number): boolean {
    return this.expandedItems.has(itemId);
  }
  scrollToTopSectionById(itemId: number): void {
    const section = this.topSections.find(
      (element) => element.nativeElement.id === `section-${itemId}`
    );
    if (section) {
      section.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setTimeout(() => {
        window.scrollBy({ top: -20, behavior: 'smooth' });
      }, 300);
    }
  }
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      this.bottomReached() &&
      !this.isLoading() &&
      this.baseDataReport?.hasNextPage
    ) {
      this.reportsWithPagination(++this.page, 2);
    }
  }
  private bottomReached(): boolean {
    return (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
    );
  }
}
