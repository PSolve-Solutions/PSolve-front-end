import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
@Component({
  selector: 'app-contest-header',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './contest-header.component.html',
  styleUrls: ['./contest-header.component.scss'],
})
export class ContestHeaderComponent {}
