import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [],
  templateUrl: './Communities.component.html',
  styleUrls: ['./Communities.component.scss'],
})
export class CommunitiesComponent {
  @Input() clientData: { id: string; name: string; logoUrl: string }[] = [];
}
