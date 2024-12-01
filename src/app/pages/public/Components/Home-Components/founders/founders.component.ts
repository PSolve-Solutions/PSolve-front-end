import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-founders',
  standalone: true,
  imports: [CommonModule,NgOptimizedImage],
  templateUrl: './founders.component.html',
  styleUrls: ['./founders.component.scss']
})
export class FoundersComponent {
  founders:any[]=[
    {
      id:1,
      img:"../../../../../assets/img_public/zyad.png",
      name:"Zyad Bahaa"
    },
    {
      id:2,
      img:"../../../../../assets/img_public/Ahmed.png",
      name:"Ahmed Alaa"
    },
    {
      id:3,
      img:"../../../../../assets/img_public/karim.png",
      name:"Karim Abdelrhman"
    }
  ]
}
