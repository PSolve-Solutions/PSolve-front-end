import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';


@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './Communities.component.html',
  styleUrls: ['./Communities.component.scss']
})
export class CommunitiesComponent {
  @Input() clientData!: any; // Input property




  // images = [
  //   'assets/img_public/p_solve_home/Community (1).svg',
  //   'assets/img_public/p_solve_home/Community (2).svg',
  //   'assets/img_public/p_solve_home/Community (3).svg',
  //   'assets/img_public/p_solve_home/Community (4).svg',
  //   'assets/img_public/p_solve_home/Community (5).svg',
  //   'assets/img_public/p_solve_home/Community (6).svg'
  // ];


}
