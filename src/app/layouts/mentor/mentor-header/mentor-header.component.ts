import { NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { TraineesService } from '../../../pages/mentor/services/trainees.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-mentor-header',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './mentor-header.component.html',
  styleUrl: './mentor-header.component.scss',
})
export class MentorHeaderComponent {
  campid: any;
  refreshRouterOutlet() {
    this.router
      .navigateByUrl('/mentor/blank', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([
          'mentor/' + this.getFullPath(this.activatedRoute),
        ]);
      });
  }
  change(id: any, name: any) {
    this.campid = id;
    this.campName = name;
    // this.train(this.campid , this.campName);
  }
  camps: any;
  constructor(
    private service: TraineesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.get();
  }
  getFullPath(route: ActivatedRoute): string {
    let path = route.snapshot.url.map((segment) => segment.path).join('/');
    // Recursively add paths from child routes if they exist
    if (route.firstChild) {
      path += '/' + this.getFullPath(route.firstChild);
    }
    return path;
  }
  campName: any = localStorage.getItem('cName')
    ? localStorage.getItem('cName')
    : 'Select Camp';
  show() {
    this.isShow = !this.isShow;
    if (this.isShow) {
      this.get();
    }
  }
  isShow = false;
  get() {
    this.service.getData().subscribe((response: ResponseHeader) => {
      if (response.isSuccess) {
        this.camps = response.data;
        // this.campid = this.camps[0].id || null;
        // this.campName = this.camps[0].name || null;
        // localStorage.setItem("cName" , this.campName);
      } else {
        this.campid = null;
        console.error('Error:', response.message);
      }
    });
  }
  trainees: any;
  train(id: any, name: any) {
    this.change(id, name);
    localStorage.setItem('camp', this.campid);
    localStorage.setItem('cName', this.campName);
    this.campName = localStorage.getItem('cName')
      ? localStorage.getItem('cName')
      : 'Select Camp';
    this.get();
    this.refreshRouterOutlet();
    // this.service.trainees(id).subscribe((response: ResponseHeader) => {
    //   if (response.isSuccess) {
    //     this.trainees = response.data;
    //     localStorage.setItem("trainees" , JSON.stringify(this.trainees));
    //     this.change(id, name);
    //     localStorage.setItem("camp" , this.campid);
    //     localStorage.setItem("cName" , this.campName);
    //     this.campName = localStorage.getItem("cName")?localStorage.getItem("cName"): 'Select Camp';
    //     this.get();
    //     this.refreshRouterOutlet();
    //   } else {
    //     this.trainees =  null;
    //     console.error('Error:', response.message);
    //   }
    // });
    this.isShow = !this.isShow;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Check if the click was outside the dropdown and the related button
    if (!target.closest('.relative') && !target.closest('.dropdown')) {
      this.isShow = false;
    }
  }
}
