import { DatePipe } from '@angular/common';
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
  selector: 'app-above-report',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './above-report.component.html',
  styleUrl: './above-report.component.scss',
})
export class AboveReportComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() reportInfo: any;
  @ViewChild('doughnutChart') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('genderChart') genderCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('collegePieCanvas')
  collegePieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('yearsDoughnutCanvas')
  yearsDoughnutCanvas!: ElementRef<HTMLCanvasElement>;

  private isViewInitialized = false;
  private chart: Chart | undefined;
  private genderChart: Chart | undefined;
  private collegeChart: Chart | undefined;
  private yearChart: Chart | undefined;

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.renderChart();
    this.renderChartForGender();
    this.renderCollegePieChart();
    this.renderChartForYear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isViewInitialized && changes['reportInfo'] && this.reportInfo) {
      this.renderChart();
      this.renderChartForGender();
      this.renderCollegePieChart();
      this.renderChartForYear();
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
      type: 'doughnut',
      data: {
        labels: ['عدد المتدربين'],
        datasets: [
          {
            data: [
              this.reportInfo?.progressPrecentage,
              100 - this.reportInfo?.progressPrecentage,
            ],
            backgroundColor: ['#002C3D', '#FFf'],
            borderColor: '#000000',
            borderWidth: 2,
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
          String(this.reportInfo?.progressPrecentage),
          'bold 30px Arial',
          'black'
        ),
      ],
    });
  }

  doughnutCenterTextPlugin(): Plugin {
    return {
      id: 'doughnutCenterTextPlugin',
      afterDraw: (chart) => {
        const {
          ctx,
          chartArea: { width, height },
        } = chart;
        ctx.save();

        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((element, index) => {
            const dataValue = dataset.data[index] as number;
            const position = element.tooltipPosition(false);

            ctx.fillStyle = '#fff';
            ctx.font = `12px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const text = `${dataValue}%`;
            ctx.fillText(text, position.x, position.y);
          });
        });

        ctx.restore();
      },
    };
  }

  renderChartForGender(): void {
    if (!this.genderCanvas) {
      console.error('Canvas element is not available.');
      return;
    }

    if (this.genderChart) {
      this.genderChart.destroy();
    }

    const ctx = this.genderCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }

    const roundedMalePercentage = Math.round(this.reportInfo?.malePrecentage);
    const roundedFemalePercentage = Math.round(
      this.reportInfo?.femalePrecentage
    );
    const data =
      this.reportInfo?.malePrecentage + this.reportInfo?.femalePrecentage === 0
        ? [1, 1]
        : [roundedMalePercentage, roundedFemalePercentage];

    this.genderChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [
          {
            data: data,
            backgroundColor: ['#63ABFD', '#F765A3'],
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
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
            },
          },
          tooltip: {
            enabled:
              this.reportInfo?.malePrecentage +
                this.reportInfo?.femalePrecentage >
              0,
          },
        },
      } as any,

      plugins: [this.doughnutCenterTextPlugin()],
    });
  }

  renderCollegePieChart(): void {
    if (!this.collegePieCanvas) {
      console.error('Canvas element is not available.');
      return;
    }

    if (this.collegeChart) {
      this.collegeChart.destroy();
    }

    const ctx = this.collegePieCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }

    const lableCollege = this.reportInfo?.traineesColleges.map(
      (y: any) => y.college
    );
    const dataCollege = this.reportInfo?.traineesColleges.map((y: any) =>
      Math.round(y.precentage)
    );
    const data =
      this.reportInfo?.traineesColleges.length === 0
        ? [1, 1, 1, 1, 1, 1]
        : dataCollege;
    const labels =
      this.reportInfo?.traineesColleges.length === 0
        ? [
            'Computer and AI',
            'Engineering',
            'EELU',
            'Law',
            'Science',
            'Commerce',
          ]
        : lableCollege;

    this.collegeChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '0%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15,
              fontSize: '12px',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      } as any,

      plugins: [this.doughnutCenterTextPlugin()],
    });
  }

  renderChartForYear(): void {
    if (!this.yearsDoughnutCanvas) {
      console.error('Canvas element is not available.');
      return;
    }

    if (this.yearChart) {
      this.yearChart.destroy();
    }

    const ctx = this.yearsDoughnutCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found');
      return;
    }
    const lableYear = this.reportInfo?.traineesGrades.map((y: any) =>
      String('Year ' + y.grade)
    );
    const dataYear = this.reportInfo?.traineesGrades.map((y: any) =>
      Math.round(y.precentage)
    );
    const data =
      this.reportInfo?.traineesGrades.length === 0 ? [1, 1, 1, 1, 1] : dataYear;
    const labels =
      this.reportInfo?.traineesGrades.length === 0
        ? ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']
        : lableYear;

    this.yearChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#63ABFD',
              '#E69C24',
              '#66AE1F',
              '#F765A3',
              '#a155b9',
            ],
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
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 15,
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      } as any,

      plugins: [this.doughnutCenterTextPlugin()],
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.genderChart) {
      this.genderChart.destroy();
    }
    if (this.collegeChart) {
      this.collegeChart.destroy();
    }
    if (this.yearChart) {
      this.yearChart.destroy();
    }
  }
}
