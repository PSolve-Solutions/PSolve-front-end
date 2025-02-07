import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, Plugin, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() contestRates!: { id: number; name: string; rate: number }[];
  @ViewChild('lineChartCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  private isViewInitialized = false;
  private chart: Chart | undefined;
  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.renderChart();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isViewInitialized && changes['contestRates']) {
      this.renderChart();
    }
  }
  renderChart(): void {
    if (!this.canvas) {
      console.error('Canvas element is not available.');
      return;
    }
    if (this.chart) {
      this.chart.destroy();
    }
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.contestRates.map((item) => item.name),
        datasets: [
          {
            data: this.contestRates.map((item) => item.rate),
            borderColor: '#002C3D',
            pointBackgroundColor: '#002C3D',
            pointBorderColor: '#002C3D',
            pointRadius: 5,
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: false,
            offset: true,
            ticks: {
              padding: 10,
              maxRotation: 0,
              minRotation: 0,
            },
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 25,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }
  ngOnDestroy(): void {
    // Destroy chart instance to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
