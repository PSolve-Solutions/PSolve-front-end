import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../authentication/services/auth.service';
import { EditImagePopComponent } from '../edit-image-pop/edit-image-pop.component';
@Component({
  selector: 'app-sidebar-profile',
  standalone: true,
  imports: [NgClass, RouterLinkActive, RouterLink, EditImagePopComponent],
  templateUrl: './sidebar-profile.component.html',
  styleUrl: './sidebar-profile.component.scss',
})
export class SidebarProfileComponent implements OnInit {
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  elementRef = inject(ElementRef);
  profilePhoto: string = '';
  currentUser: any;
  currentPath: string = '';
  showPopup: boolean = false;
  image: string | null = null;
  openPopup(): void {
    this.showPopup = true;
  }
  closePopup(): void {
    this.showPopup = false;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    console.log(clickedInside);
    if (!clickedInside) {
      this.closePopup();
    }
  }
  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.currentUser = this.authService.currentUser();
    this.profilePhoto = this.authService.currentUser().photoUrl;
    this.detectLocalStorageChange();
  }
  detectLocalStorageChange(): void {
    const storedData = JSON.parse(localStorage.getItem('CURRENT_USER') || '{}');
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (key: string, value: string): void => {
      originalSetItem.apply(localStorage, [key, value]);
      if (key === 'CURRENT_USER') {
        // this.authService.updatePhotoUrl(storedData.photoUrl);
        this.profilePhoto = storedData.photoUrl;
        this.cdr.detectChanges();
        console.log(this.authService.currentUser().photoUrl);
      }
    };
  }
}
