import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { HomeHeroComponent } from '../../Components/Home-Components/home-hero/home-hero.component';
import { AboutUsComponent } from "../../Components/Home-Components/about-us/about-us.component";
import { AchievementsComponent } from "../../Components/Home-Components/achievements/achievements.component";
import { CommonModule } from '@angular/common';
import { FoundersComponent } from "../../Components/Home-Components/founders/founders.component";
import { CoachesComponent } from "../../Components/Home-Components/coaches/coaches.component";
import { FeedbackComponent } from "../../Components/Home-Components/feedback/feedback.component";
import { RouterLink } from '@angular/router';
import { HomeService } from '../../Services/home.service';

declare var $: any;

@Component({
  selector: 'app-home-public',
  standalone: true,
  imports: [
    HomeHeroComponent,
    AboutUsComponent,
    AchievementsComponent,
    CommonModule,
    FoundersComponent,
    CoachesComponent,
    FeedbackComponent,
    RouterLink,
    CommonModule
],
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.scss']
})
export class HomePublicComponent  {
  public homeService = inject(HomeService);

  show:boolean=true

  hidden():void{
    this.show=!this.show
  }
  ngOnInit(): void {
    this.getBoolean()
  }


  getBoolean():void{
    this.homeService.anyOpenCamps().subscribe({
      next:({statusCode,data})=>{
        if(statusCode===200){
          this.show=data
        }
      }
    })
  }


}

