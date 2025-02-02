import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss',
})
export class CardsComponent {}
