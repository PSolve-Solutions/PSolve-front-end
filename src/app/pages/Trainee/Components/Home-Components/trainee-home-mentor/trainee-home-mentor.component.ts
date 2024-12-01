import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '../../../Services/home.service';
import { Mentor } from '../../../model/trinee-home';
import { ResponsiveService } from '../../../Services/responsive.service';
declare var $: any;

@Component({
  selector: 'app-trainee-home-mentor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trainee-home-mentor.component.html',
  styleUrls: ['./trainee-home-mentor.component.scss'] // Corrected styleUrls from styleUrl
})
export class TraineeHomeMentorComponent implements OnInit {

  // Inject HomeService to interact with the backend
  private _homeService = inject(HomeService);
  public responsive = inject(ResponsiveService);

  //control show more
  showMore:boolean=true

  // Define mentorData with a type of Mentor
  mentorData: Mentor = {} as Mentor;

  ngOnInit(): void {
    // Load mentor information when the component initializes
    this.loadMentorInfo();
  }

  // Private method to load mentor information from the service
  private loadMentorInfo(): void {
    this._homeService.MentorInfo().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          // Update mentorData with the received data
          this.mentorData = data;
        }
      },
      error: (error) => {
        // Handle error case (optional)
        console.error('Error loading mentor info:', error);
      }
    });
  }
  toggleText():void{
    $('.long-text').toggleClass('line-clamp-2')
    this.showMore = !this.showMore;
  }
}
