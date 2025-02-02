import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
@Component({
  selector: 'app-incoming-cards',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './incoming-cards.component.html',
  styleUrl: './incoming-cards.component.scss',
})
export class IncomingCardsComponent {}
