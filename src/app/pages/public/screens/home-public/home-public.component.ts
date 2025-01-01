import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { HomeHeroComponent } from '../../Components/Home-Components/home-hero/home-hero.component';
import {  LeaderSlider } from "../../Components/Home-Components/leader-slider/leader.slider.component";
import { HeadOfCampSlider } from "../../Components/Home-Components/Head-of-camp-slider/Head-of-camp-slider.component";
import { CommonModule } from '@angular/common';
import {  MentorsComponent } from "../../Components/Home-Components/Mentors/mentors.slider.component";
import { FoundersComponent } from "../../Components/Home-Components/founder/founders.component";
import { TraineeComponent } from "../../Components/Home-Components/trainee/trainee.slider.component";
import { RouterLink } from '@angular/router';
import { HomeService } from '../../Services/home.service';
import { CommunitiesComponent } from '../../Components/Home-Components/Communities/Communities.component';
import { AboutusComponent } from "../../Components/Home-Components/aboust-us/aboutus.component";
import { FooterComponent } from "../../../../layouts/layout_public/components/footer/footer.component";


@Component({
  selector: 'app-home-public',
  standalone: true,
  imports: [
    HomeHeroComponent,
    LeaderSlider,
    HeadOfCampSlider,
    CommonModule,
    MentorsComponent,
    TraineeComponent,
    FoundersComponent,
    CommunitiesComponent,

    CommonModule,
    AboutusComponent,
],
  templateUrl: './home-public.component.html',
  styleUrls: ['./home-public.component.scss']
})
export class HomePublicComponent  {
  public homeService = inject(HomeService);


  Clintes: any;

  ngOnInit(): void {
    this.getAllClintes()
  }


  // getBoolean():void{
  //   this.homeService.anyOpenCamps().subscribe({
  //     next:({statusCode,data})=>{
  //       if(statusCode===200){
  //         this.show=data
  //       }
  //     }
  //   })
  // }
  getAllClintes():void{
    this.homeService.getClintes().subscribe({
      next:({statusCode,data})=>{
        this.Clintes = data

      }
    })
  }


}

