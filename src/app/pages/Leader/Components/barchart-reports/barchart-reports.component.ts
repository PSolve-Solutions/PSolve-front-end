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
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-barchart-reports',
  standalone: true,
  imports: [],
  templateUrl: './barchart-reports.component.html',
  styleUrl: './barchart-reports.component.scss',
})
export class BarchartReportsComponent
  implements OnChanges, OnDestroy, AfterViewInit
{
  @Input() sheetsRates!: { id: number; name: string; rate: number }[];
  @ViewChild('barChartCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | undefined;
  private isViewInitialized = false;
  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.renderChart();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isViewInitialized && changes['sheetsRates']) {
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
      type: 'bar',
      data: {
        labels: this.sheetsRates.map((item) => item.name),
        datasets: [
          {
            data: this.sheetsRates.map((item) => item.rate),
            backgroundColor: '#002C3D',
            borderWidth: 1,
            borderRadius: {
              topLeft: 10,
              topRight: 10,
              bottomLeft: 0,
              bottomRight: 0,
            },
            barPercentage: 0.5,
            categoryPercentage: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              maxRotation: 0,
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 25,
              callback: (tickValue: string | number) => {
                if (typeof tickValue === 'number') {
                  return `${tickValue}%`;
                }
                return tickValue;
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                let value = context.raw;
                return `${value}%`;
              },
            },
          },
        },
      },
    });
  }
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
