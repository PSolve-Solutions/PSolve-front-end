import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HocSideBarComponent } from './components/hoc-side-bar/hoc-side-bar.component';
import { SecondNavbarComponent } from '../layout_leader/components/second-navbar/second-navbar.component';

@Component({
  selector: 'app-hoc-layout',
  standalone: true,
  imports: [RouterOutlet, HocSideBarComponent, SecondNavbarComponent],
  templateUrl: './hoc-layout.component.html',
  styleUrl: './hoc-layout.component.scss',
})
export class HocLayoutComponent {}
