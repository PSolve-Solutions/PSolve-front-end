import { Component, inject } from '@angular/core';
import { HomeService } from '../../../Services/home.service';
import { CurrentSheet, InComingContest, NextSession } from '../../../model/trinee-home';
import { CommonModule, DatePipe } from '@angular/common';
import { FormatDatePipe } from '../../../Pipes/formatte-Date.pipe';

@Component({
  selector: 'app-trainee-cards',
  standalone: true,
  imports: [CommonModule,FormatDatePipe],
  templateUrl: './trainee-cards.component.html',
  styleUrl: './trainee-cards.component.scss',
})
export class TraineeCardsComponent {

  // Injected services
  private homeService = inject(HomeService);

  // Component state variables
  public currentSheet: CurrentSheet = {
    endDate:'',
    name:'No sheet',
    problemCount:0,
    problemSolvedCount:0,
    id:0,
    sheetLink:'no Links',
    startDate:''
  };
  public inComingContest: InComingContest = {
    name: 'No Contest In Coming',
    link: 'none',
    remainTime: {
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  } as InComingContest;
  public nextSession: NextSession = {
    campId:0,
    id:0,
    locationLink:'',
    startDate:'',
    topic:'No Sessions',
    instructorName:'Null',
    endDate:'',
    locationName:'Null'
  };
  intervalId:any
  days:number=0
  hours:number=0
  min:number=0
  second:number=0

  // Lifecycle hook: Initializes the component
  ngOnInit(): void {
    this.loadSheetData();   // Load current sheet data
    this.loadContestData(); // Load incoming contest data
    this.loadSessionData(); // Load next session data
  }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


  // Fetches the current sheet data from the service
  private loadSheetData(): void {
    this.homeService.currentSheet.subscribe({
      next: (data) => {
          this.currentSheet = data; // Update the state with fetched data
      }
    });
  }

  // Fetches the incoming contest data from the service
  private loadContestData(): void {
    this.homeService.inComingContest.subscribe({
      next: (data) => {
        this.inComingContest = data; // Update the state with fetched data
        this.days=data.remainTime.days
        this.hours=data.remainTime.hours
        this.min=data.remainTime.minutes
        this.second=data.remainTime.seconds
        this.startCountdown()

      }
    });
  }

  // Fetches the next session data from the service
  private loadSessionData(): void {
    this.homeService.nextSession.subscribe({
      next: (data) => {
          this.nextSession = data; // Update the state with fetched data


      }
    });
  }

  // Formats event start and end dates into a human-readable string
  // Example: (startDate, endDate) -> "Thursday 22/08 Starting from 10:00 AM to 04:00 PM"
  public formatEventDates(startDate: string|null, endDate: string|null, detailed: boolean): string {
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Extract day of the week
        const day = start.toLocaleString('en-US', { weekday: 'long' });

        // Format the date to "dd/mm/yyyy" without the year for detailed view
        const datePart = start.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

        // Format start and end time
        const startTime = start.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
        const endTime = end.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        if (detailed) {
            // Detailed format
            return `${day} ${datePart} Starting from ${startTime} to ${endTime}`;
        } else {
            // Simple format
            const simpleDatePart = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
            return `${day} ${simpleDatePart}, ${startTime} to ${endTime}`;
        }
    } else {
        return 'No Date';
    }
}


  //counter
  public startCountdown(): void {
    this.intervalId = setInterval(() => {
      if (this.second === 0) {
        if (this.min === 0) {
          if (this.hours === 0) {
            if (this.days === 0) {
              clearInterval(this.intervalId);
              // Optionally handle when countdown finishes
            } else {
              this.days--;
              this.hours = 23;
              this.min = 59;
              this.second = 59;
            }
          } else {
            this.hours--;
            this.min = 59;
            this.second = 59;
          }
        } else {
          this.min--;
          this.second = 59;
        }
      } else {
        this.second--;
      }
    }, 1000); // Update every second
  }

  // Opens a given URL in a new browser tab
  public openLink(url: string): void {
    if(typeof url == 'string'){
      window.open(url, '_blank');
    }
  }
}

