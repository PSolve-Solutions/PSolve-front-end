import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../../authentication/services/auth.service';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.scss',
})
export class SidebarAdminComponent {
  authService = inject(AuthService);
  @Output() isOpen = new EventEmitter<boolean>();
  isShow: boolean = true;

  show(): void {
    this.isShow = !this.isShow;
    this.isOpen.emit(this.isShow);
  }
}
