import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { FounderChildComponent } from "./founder-child/founder.child.component";


@Component({
  selector: 'app-founders',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FounderChildComponent],
  templateUrl: './founders.component.html',
  styleUrls: ['./founders.component.scss']
})
export class FoundersComponent {

  allFounders:object[]=[
    {image:'assets/img_public/p_solve_home/omar_alaa.jpg',name:"omar alaa",skills:['Project Team lead','Backend developer'],link:"https://www.linkedin.com/in/omar-alznaty"},
    {image:'assets/img_public/p_solve_home/hassan_alaa.jpeg',name:"hassan alaa",skills:['Front-end developer', 'Angular'],link:"https://www.linkedin.com/in/hassan-alaa-77907729b/"},
    {image:'assets/img_public/p_solve_home/founder.svg',name:"Mostafa Ahmed",skills:['Frontend developer','Angular'],link:"https://www.linkedin.com/in/moustafa-ahmed-04b887229"},
    {image:'assets/img_public/p_solve_home/founder.svg',name:"Mostafa Osama",skills:['Frontend developer', 'Angular'],link:"https://www.linkedin.com/in/mustafa-osama-318617225"},
    {image:'assets/img_public/p_solve_home/founder.svg',name:"Gelan Ayman",skills:['ui/ux','Designer'],link:"https://www.linkedin.com/in/gelan-ayman-8b2424216"},
    {image:'assets/img_public/p_solve_home/founder.svg',name:"Maria Aldabea",skills:['ui/ux','Designer'],link:"https://www.linkedin.com/in/maria-aldabea-a085b3219"},
  ]


}
