import { Component, OnInit, OnDestroy } from '@angular/core';
import { MentornavComponent } from '../mentornav/mentornav.component';
import { NavigationEnd, Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // Import Subscription if needed in future
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-mentor-layout',
  standalone: true,
  imports: [MentornavComponent, RouterOutlet, CommonModule],
  templateUrl: './mentor-layout.component.html',
  styleUrls: ['./mentor-layout.component.scss'] // Fixed from `styleUrl` to `styleUrls`
})
export class MentorLayoutComponent implements OnInit, OnDestroy {
  camp: boolean = false;
  private routerSubscription?: Subscription; // Declare routerSubscription if needed

  constructor(private router: Router, private titleService: Title , private active :ActivatedRoute) {
    this.checkCampStatus();
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Handle view changes here
        this.onRouteChange(event.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe from router events if subscribed
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Method to check the camp status from localStorage
  private checkCampStatus() {
    this.camp = localStorage.getItem('camp') ? true : false;
   if(this.router.url == '/mentor/profile'){
    this.camp = true;
   }
  }

  private onRouteChange(url: string){
    this.camp = localStorage.getItem('camp') ? true : false;
    if(this.router.url == '/mentor/profile'){
      this.camp = true;
     }
  }

}