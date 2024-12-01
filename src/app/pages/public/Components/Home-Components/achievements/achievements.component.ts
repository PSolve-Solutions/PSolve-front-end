import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule,NgOptimizedImage],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent {
  achievements:any[]=[
    {
      id:1,
      img:"../../../../../assets/img_public/achivements_1.png",
      text:"4th on Egypt (ECPC 2024)"
    },
    {
      id:2,
      img:"../../../../../assets/img_public/achivements_2.png",
      text:"10th on Egypt (ECPC 2023)"
    },
    {
      id:3,
      img:"../../../../../assets/img_public/achivements_3.png",
      text:"Helped 147 students to participate in ECPC Qualifications (2022)"
    }
  ]
}
