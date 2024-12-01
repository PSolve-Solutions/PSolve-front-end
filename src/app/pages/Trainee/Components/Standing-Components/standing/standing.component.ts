import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from '../../../Pipes/formatte-Date.pipe';
import { StandingService } from '../../../Services/standing.service';
import { Achiver } from '../../../model/trinee-standing';
import { ResponsiveService } from '../../../Services/responsive.service';

@Component({
  selector: 'app-standing',
  standalone: true,
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.scss'],
})
export class StandingComponent implements OnInit {

  private standingService = inject(StandingService);
          responsive = inject(ResponsiveService);

  greenZone: Achiver[] = [];
  yellowZone: Achiver[] = [];
  redZone: Achiver[] = [];
  isLoading = true;
  currentUser: any;
  totalProblems:number=0

  ngOnInit(): void {
    this.fetchStandings();
    this.loadCurrentUser();
  }

  private fetchStandings(): void {
    this.standingService.getStanding().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.isLoading = false;
          this.totalProblems = data.totalProblems;
          this.categorizeTrainees(data.achivers, data.totalProblems);
        }
      }
    });
  }

  private categorizeTrainees(trainees: Achiver[], totalProblems: number): void {
    const calculatePercentage = (solvedProblems: number) => (solvedProblems / totalProblems) * 100;

    this.greenZone = trainees.filter(t => calculatePercentage(t.solvedProblems) >= 80);
    this.yellowZone = trainees.filter(t => calculatePercentage(t.solvedProblems) < 80 && calculatePercentage(t.solvedProblems) > 50);
    this.redZone = trainees.filter(t => calculatePercentage(t.solvedProblems) <= 50);

    [this.greenZone, this.yellowZone, this.redZone].forEach(zone => this.sortBySolvedProblems(zone));
  }

  private sortBySolvedProblems(zone: Achiver[]): void {
    zone.sort((a, b) => b.solvedProblems - a.solvedProblems);
  }

  private loadCurrentUser(): void {
    const userJson = localStorage.getItem('CURRENT_USER');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
    }
  }
}
