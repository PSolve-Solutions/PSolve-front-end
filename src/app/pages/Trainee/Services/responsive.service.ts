import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  isSmallScreen:Boolean = false;
  resizeObserver!:ResizeObserver;
  constructor() {
   // Initialize the ResizeObserver
   this.resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      this.checkScreenSize();
    }
  });


  }
  start():void{
    this.resizeObserver.observe(document.body);
    this.checkScreenSize(); // Initial check
  }
  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 640 ;
  }
    // Method to clean up (unobserve)
    destroy() {
      if (this.resizeObserver) {
        this.resizeObserver.unobserve(document.body); // Stop observing
      }
    }




}
