import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables, Plugin, ArcElement } from 'chart.js';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeService } from '../../../Services/home.service';
import { NextPractice } from '../../../model/trinee-home';

Chart.register(...registerables);

@Component({
  selector: 'app-trainee-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trainee-chart.component.html',
  styleUrls: ['./trainee-chart.component.scss'],
  providers: [DatePipe],
})
export class TraineeChartComponent implements OnInit, AfterViewInit {
  private _homeService = inject(HomeService);
  private _DatePipe = inject(DatePipe);
  nextPractice: NextPractice = {} as NextPractice;
  solvedProblems: number = 0;
  minimumProblems: number = 0;
  AllProblems: number = 0;
  public chart: any;

  ngOnInit(): void {
    this.loadNextPracticeData();
    this.loadChartData();
  }

  ngAfterViewInit(): void {}

  createChart(solved: number, minToSolve: number, total: number): void {
    const ctx = document.getElementById('myDoughnutChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            label: 'Solved Precentage',
            data: [(solved / total) * 100],
            backgroundColor: ['#00AC47'],
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 12,
            circumference: (solved / total) * 360,
          },
          {
            label: 'Minimum Precentage',
            data: [minToSolve],
            backgroundColor: ['#EF4A50'],
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 12,
            circumference: (minToSolve * 360) / 100,
          },
          {
            label: 'Total Precentage',
            data: [100],
            backgroundColor: ['#E5E5E5'],
            borderColor: 'transparent',
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,

        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { title: () => '' } },
          title: { display: false },
        },
      },
      plugins: [
        this.createDoughnutBackgroundPlugin('#fff'),
        this.createDoughnutOverlappingPlugin(),
      ],
    });
  }

  createDoughnutOverlappingPlugin(): Plugin {
    return {
      id: 'doughnutBackgroundPlugin',
      beforeDraw: (chart) => {
        const { ctx, data } = chart;

        const meta = chart.getDatasetMeta(2); // Get the dataset meta
        const element = meta.data[0] as ArcElement; // Assert the type to ArcElement

        const innerRadius = element.innerRadius; // Now TypeScript recognizes innerRadius
        const outerRadius = element.outerRadius; // Now TypeScript recognizes outerRadius

        ctx.save();
        data.datasets.forEach((_, index) => {
          let meta = chart.getDatasetMeta(index); // Get the dataset meta
          let element = meta.data[0] as ArcElement; // Assert the type to ArcElement
          element.innerRadius = innerRadius;
          element.outerRadius = outerRadius;
        });
      },
    };
  }

  createDoughnutBackgroundPlugin(backgroundColor: string): Plugin {
    return {
      id: 'doughnutBackgroundPlugin',
      beforeDraw: (chart) => {
        const { ctx, chartArea } = chart;
        const { top, bottom, left, right } = chartArea;
        const width = right - left;
        const height = bottom - top;
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const meta = chart.getDatasetMeta(0).data[0] as any;
        const cutout = (chart.config.options as any).cutout || '85%';
        const cutoutRadius = (meta.outerRadius * parseFloat(cutout)) / 85;

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, cutoutRadius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = backgroundColor;
        ctx.fill();
        ctx.restore();
      },
    };
  }

  copyText(link: string): void {
    navigator.clipboard.writeText(link);
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';

    const date = new Date(dateTimeString);
    const dayOfWeek = this._DatePipe.transform(date, 'EEEE');
    const day = this._DatePipe.transform(date, 'd');
    const month = this._DatePipe.transform(date, 'M');
    const year = this._DatePipe.transform(date, 'yyyy');
    const time = this._DatePipe.transform(date, 'h:mm a');

    return `${dayOfWeek} ${day}/${month}/${year} Starts at ${time}`;
  }

  loadNextPracticeData(): void {
    this._homeService.nextPractice().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.nextPractice = data;
        }
      },
    });
  }

  loadChartData(): void {
    this._homeService.TraineeSheetProgress().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.minimumProblems = data.minimumPrecent;
          this.solvedProblems = data.solvedProblemsCount;
          this.AllProblems = data.totalProblemsCount;
          this.createChart(
            this.solvedProblems,
            this.minimumProblems,
            this.AllProblems
          );
        }
      },
    });
  }
  roundIfHasDecimal(num: number): number {
    return Math.round(num);
  }
}
