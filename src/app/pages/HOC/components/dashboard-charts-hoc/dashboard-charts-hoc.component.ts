import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DashboardData } from '../../model/dashboarf-hoc';
import { Chart, Plugin, registerables } from 'chart.js';
import { NgClass } from '@angular/common';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard-charts-hoc',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dashboard-charts-hoc.component.html',
  styleUrl: './dashboard-charts-hoc.component.scss',
})
export class DashboardChartsHocComponent implements OnInit, AfterViewInit {
  @Input() dashboardData!: DashboardData;
  @ViewChild('traineesCanvas', { static: true })
  traineesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mentorsCanvas', { static: true })
  mentorsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('campProgressCanvas', { static: true })
  campProgressCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChartCanvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChartCanvas') canvasContest!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;
  chartContest: Chart | undefined;

  traineesChart: any;
  mentorsChart: any;
  campProgressChart: any;

  ngOnInit() {
    this.renderTraineesChart();
    this.renderMentorsChart();
    this.renderCampProgressChart();
  }
  ngAfterViewInit(): void {
    this.renderChart();
    this.renderChartContest();
  }

  renderTraineesChart(): void {
    const traineesCtx = this.traineesCanvas.nativeElement.getContext('2d');
    if (traineesCtx) {
      const gradientFemale = traineesCtx.createLinearGradient(0, 0, 0, 400);
      gradientFemale.addColorStop(0, '#EA82E0');
      gradientFemale.addColorStop(1, '#f4ace8');
      this.traineesChart = new Chart(traineesCtx, {
        type: 'doughnut',
        data: {
          labels: ['Male', 'Female'],
          datasets: [
            {
              label: 'Trainees',
              data: [
                this.dashboardData.traineesMalePrecentage,
                this.dashboardData.traineesFemalePrecentage,
              ],
              backgroundColor: ['#3D91C7', gradientFemale],
              hoverOffset: 4,
              borderWidth: 0,
              borderJoinStyle: 'round',
            },
          ],
        },
        options: {
          cutout: '70%',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }

  renderMentorsChart(): void {
    const mentorsCtx = this.mentorsCanvas.nativeElement.getContext('2d');
    if (mentorsCtx) {
      const gradientFemale = mentorsCtx.createLinearGradient(0, 0, 0, 400);
      gradientFemale.addColorStop(0, '#EA82E0');
      gradientFemale.addColorStop(1, '#f4ace8');
      this.mentorsChart = new Chart(mentorsCtx, {
        type: 'doughnut',
        data: {
          labels: ['Male', 'Female'],
          datasets: [
            {
              label: 'Mentors',
              data: [
                this.dashboardData.mentorsMalePrecentage,
                this.dashboardData.mentorsFemalePrecentage,
              ],
              backgroundColor: ['#3D91C7', gradientFemale],
              hoverOffset: 4,
              borderWidth: 0,
              borderJoinStyle: 'round',
            },
          ],
        },
        options: {
          responsive: true,
          cutout: '70%',
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }
  createCenterTextPlugin(text: string, font: string, color: string): Plugin {
    return {
      id: 'centerTextPlugin',
      beforeDraw: (chart) => {
        const { ctx, chartArea } = chart;
        const { top, bottom, left, right } = chartArea;
        const width = right - left;
        const height = bottom - top;
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const meta = chart.getDatasetMeta(0).data[0] as any;
        const cutout = (chart.config.options as any).cutout || '65%';
        const cutoutRadius = (meta.outerRadius * parseFloat(cutout)) / 100;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text + '%', centerX, centerY);
        ctx.restore();
      },
    };
  }
  renderCampProgressChart(): void {
    if (!this.campProgressCanvas) {
      console.error('Canvas element is not available.');
      return;
    }

    const ctx = this.campProgressCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }
    this.campProgressChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [' Camp Progress'],
        datasets: [
          {
            data: [
              this.dashboardData.progressPrecentage,
              100 - this.dashboardData?.progressPrecentage,
            ],
            backgroundColor: ['#3D91C7', '#e5e5e5'],

            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: () => '',
            },
          },
          title: {
            display: false,
          },
        },
      } as any,

      plugins: [
        this.createCenterTextPlugin(
          String(this.dashboardData?.progressPrecentage),
          'bold 30px Arial',
          'black'
        ),
      ],
    });
  }

  renderChartContest(): void {
    if (!this.canvasContest) {
      console.error('Canvas element is not available.');
      return;
    }

    const ctx = this.canvasContest.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }

    this.chartContest = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dashboardData.contestsAnalysis.map((item) => item.name),
        datasets: [
          {
            data: this.dashboardData.contestsAnalysis.map(
              (item) => item.precentage
            ),
            borderColor: '#3D91C7',
            pointBackgroundColor: '#3D91C7',
            pointBorderColor: '#3D91C7',
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
                return `${Math.round(value)}%`;
              },
            },
          },
        },
      },
    });
  }
  renderChart(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.dashboardData.sheetsAnalysis.map((item) => item.name),
        datasets: [
          {
            data: this.dashboardData.sheetsAnalysis.map((item) =>
              Math.round(item.precentage)
            ),
            backgroundColor: '#3D91C7',
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
              callback: (tickValue: string | number) => {
                if (typeof tickValue === 'number') {
                  return `${Math.round(tickValue)}%`;
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
                return `${Math.round(value)}%`;
              },
            },
          },
        },
      },
    });
  }
}
