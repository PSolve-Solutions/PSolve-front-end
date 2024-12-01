import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [CommonModule,NgOptimizedImage],
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent {

}
