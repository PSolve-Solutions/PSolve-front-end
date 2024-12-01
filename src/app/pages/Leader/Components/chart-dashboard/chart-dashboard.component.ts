import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Chart, Plugin, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-chart-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './chart-dashboard.component.html',
  styleUrl: './chart-dashboard.component.scss',
})
export class ChartDashboardComponent implements OnInit, AfterViewInit {
  @Input() traineesCount: number = 50;
  @Input() malesCount: number = 50;
  @Input() femalesCount: number = 50;
  percentageMales: number = 50;
  percentagefemales: number = 50;
  ngOnInit() {
    this.percentageMales = Math.round(
      (this.malesCount / this.traineesCount) * 100
    );
    this.percentagefemales = Math.round(
      (this.femalesCount / this.traineesCount) * 100
    );
  }

  ngAfterViewInit(): void {
    const lables = ['Male'];
    const lables2 = ['Female', 'No'];
    const data = [this.percentageMales, this.percentageMales - 100];
    const data2 = [this.percentagefemales, this.percentagefemales - 100];
    this.renderChart(lables, data);
    this.renderChart2(lables2, data2);
  }

  ctx = document.getElementById('chart') as HTMLCanvasElement;

  createCenterTextPlugin(
    text: string,
    font: string = 'bold 24px Arial',
    color: string = 'black'
  ): Plugin {
    return {
      id: 'centerTextPlugin',
      beforeDraw: (chart) => {
        const { ctx, chartArea } = chart;
        const { top, bottom, left, right } = chartArea;
        const width = right - left;
        const height = bottom - top;
        const centerX = left + width / 2;
        const centerY = top + height / 2;

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

  renderChart(lables: any[], data: any[]): void {
    const myChart = new Chart('chart', {
      type: 'doughnut',
      data: {
        labels: lables,

        datasets: [
          {
            data: data,
            label: 'Male',
            backgroundColor: ['#3D91C7', '#d0e5f2'],
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 12,
          },
        ],
      },
      options: {
        cutout: '85%',
        responsive: true,
        maintainAspectRatio: false,
        hover: {
          mode: null,
        },
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
        this.createDoughnutBackgroundPlugin('#d0e5f2'),
        this.createCenterTextPlugin(
          this.percentageMales ? String(this.percentageMales) : '0',
          'bold 24px Arial',
          'black'
        ),
      ],
    });
  }
  renderChart2(lables: any[], data: any[]): void {
    const myChart = new Chart('chart2', {
      type: 'doughnut',
      data: {
        labels: lables,

        datasets: [
          {
            data: data,
            label: 'Female',
            backgroundColor: ['#E69C24', '#f9e7ca'],
            borderWidth: 0,
            borderRadius: 12,
          },
        ],
      },
      options: {
        cutout: '85%',
        responsive: true,
        maintainAspectRatio: false,
        hover: {
          mode: null,
        },
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
        this.createDoughnutBackgroundPlugin('#f9e7ca'),
        this.createCenterTextPlugin(
          this.percentagefemales ? String(this.percentagefemales) : '0',
          'bold 24px Arial',
          'black'
        ),
      ],
    });
  }
}
