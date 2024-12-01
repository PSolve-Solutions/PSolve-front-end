import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-admin',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.scss',
})
export class NavbarAdminComponent {}
