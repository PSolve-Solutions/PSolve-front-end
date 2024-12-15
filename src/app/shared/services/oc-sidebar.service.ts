import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OcSidebarService {
  isOpen = signal<boolean>(true);

  openSidebar(): void {
    this.isOpen.set(!this.isOpen());
  }
}
