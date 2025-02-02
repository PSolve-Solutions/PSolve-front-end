import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Chart, Plugin, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-chart-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './chart-dashboard.component.html',
  styleUrl: './chart-dashboard.component.scss',
})
export class ChartDashboardComponent implements OnChanges, OnDestroy {
  @Input() traineesCount: number = 0;
  @Input() malesCount!: number;
  @Input() femalesCount!: number;
  percentageMales: number = 0;
  percentagefemales: number = 0;
  chart: Chart | null = null;
  chart2: Chart | null = null;
  ngOnChanges(): void {
    if (this.traineesCount !== 0) {
      this.percentageMales = Math.round(
        (this.malesCount / this.traineesCount) * 100
      );
      this.percentagefemales = Math.round(
        (this.femalesCount / this.traineesCount) * 100
      );
    }
    const data = [this.percentageMales, this.percentageMales - 100];
    const data2 = [this.percentagefemales, this.percentagefemales - 100];
    this.renderChart(['Male', 'No'], data);
    this.renderChart2(['Female', 'No'], data2);
  }
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
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('chart', {
      type: 'doughnut',
      data: {
        labels: lables,
        datasets: [
          {
            data: data,
            label: 'Male',
            backgroundColor: ['#78BDC4', '#c4e0e0'],
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
        this.createDoughnutBackgroundPlugin('#c4e0e0'),
        this.createCenterTextPlugin(
          this.percentageMales ? String(this.percentageMales) : '0',
          'bold 24px Arial',
          'black'
        ),
      ],
    });
  }
  renderChart2(lables: any[], data: any[]): void {
    if (this.chart2) {
      this.chart2.destroy();
    }
    this.chart2 = new Chart('chart2', {
      type: 'doughnut',
      data: {
        labels: lables,
        datasets: [
          {
            data: data,
            label: 'Female',
            backgroundColor: ['#F7BCBC', '#f7e0dd'],
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
        this.createDoughnutBackgroundPlugin('#f7e0dd'),
        this.createCenterTextPlugin(
          this.percentagefemales ? String(this.percentagefemales) : '0',
          'bold 24px Arial',
          'black'
        ),
      ],
    });
  }
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    if (this.chart2) {
      this.chart2.destroy();
      this.chart = null;
    }
  }
}
