import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})



export class DashboardComponent implements OnInit {
  myChart1:Chart;
  myChart2:Chart;
  myChart3:Chart;

    chart1 = {
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Premium',
          data: [50, 80, 60, 120, 80, 100, 60],
          backgroundColor: 'transparent',
          borderColor: '#5b6582',
          borderWidth: 2
        },
        {
          label: 'Free',
          data: [100, 60, 80, 50, 140, 60, 100],
          backgroundColor: 'transparent',
          borderColor: '#36a2eb',
          borderWidth: 2
        }
        ]
      },
      options: {
        scales: {
          y: {
            ticks: {
              display: true,
              fontColor: 'rgba(0,0,0,.6)',
              fontStyle: 'bold',
              beginAtZero: true,
              maxTicksLimit: 8,
              padding: 10
            }
          }
        },
        responsive: true,
        legend: {
          position: 'bottom',
          display: false
        },
      }
    };
    chart2 = {
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
          label: 'Premium',
          data: [50, 80, 60, 120, 80, 100, 60],
          backgroundColor: '#5b6582',
          borderColor: '#5b6582',
          borderWidth: 2
        },
        {
          label: 'Free',
          data: [100, 60, 80, 50, 140, 60, 100],
          backgroundColor: '#36a2eb',
          borderColor: '#36a2eb',
          borderWidth: 2
        }
        ]
      },
      options: {
        barValueSpacing: 1,
        scales: {
          y: {
            display: true,
            ticks: {
              fontColor: 'rgba(0,0,0,.6)',
              fontStyle: 'bold',
              beginAtZero: true,
              maxTicksLimit: 8,
              padding: 10
            }
          },
          x: {
            display: true,
            barPercentage: 0.4
          }
        },
        responsive: true,
        legend: {
          position: 'bottom',
          display: false
        },
      }
    };
    chart3 = {
      data: {
        datasets: [{
          data: [6, 12, 10],
          backgroundColor: ["#5b6582", "#98a4c7", "#36a2eb"],
        }],
        labels: [
          'html',
          'css',
          'javascript'
        ]
      },
      options: {
        legend: {
          position: 'bottom',
          display: false
        },
        cutout: 80
      }
    };
  
    constructor(private elementRef: ElementRef) { }

    ngOnInit() {
  
      let ctx1 = this.elementRef.nativeElement.querySelector(`#chart-line`);
      //if (this.myChart1) {
      //  this.myChart1.destroy();
      //}
      this.myChart1 = new Chart(ctx1, {
        type: 'line',
        data: this.chart1.data,
        options: this.chart1.options
      });
      let ctx2 = this.elementRef.nativeElement.querySelector(`#chart-bar`);
      this.myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: this.chart2.data,
        options: this.chart2.options
      });
      let ctx3 = this.elementRef.nativeElement.querySelector(`#chart-doughnut`);
      this.myChart3 = new Chart(ctx3, {
        type: 'doughnut',
        data: this.chart3.data,
        options:this.chart3.options
      });
  
    }
  


}
