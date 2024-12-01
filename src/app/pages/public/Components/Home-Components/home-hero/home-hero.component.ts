import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule,NgOptimizedImage],
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss']
})
export class HomeHeroComponent {
}
