import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-camps-hero',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './camps-hero.component.html',
  styleUrl: './camps-hero.component.scss'
})
export class CampsHeroComponent {

}
