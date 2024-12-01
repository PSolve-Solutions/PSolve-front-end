import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SecondNavbarComponent } from './components/second-navbar/second-navbar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

@Component({
  selector: 'app-layout-leader',
  standalone: true,
  imports: [RouterOutlet, SecondNavbarComponent, SideBarComponent],
  templateUrl: './layout-leader.component.html',
  styleUrl: './layout-leader.component.scss',
})
export class LayoutLeaderComponent {}
