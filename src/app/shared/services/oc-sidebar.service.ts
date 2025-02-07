import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class OcSidebarService {
  isOpen = signal<'hide' | 'semi' | 'show'>('show');
  // isOpenInMobile = signal<boolean>(false);
  constructor() {
    if (window.innerWidth <= 768) {
      this.isOpen.set('hide');
    } else {
      this.isOpen.set('show');
    }
  }
  openSidebar(keyword: 'hide' | 'semi' | 'show'): void {
    if (keyword === 'hide' && window.innerWidth > 768) {
      this.isOpen.set('show');
    } else {
      this.isOpen.set(keyword);
    }
  }
  // showSidebar(): void {
  //   this.isOpenInMobile.set(!this.isOpenInMobile());
  // }
}
