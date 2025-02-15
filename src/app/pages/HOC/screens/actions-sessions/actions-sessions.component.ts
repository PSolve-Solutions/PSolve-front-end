import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SessionsHOCService } from '../../services/sessions-hoc.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
@Component({
  selector: 'app-actions-sessions',
  standalone: true,
  imports: [ReactiveFormsModule, ToastrModule, NgClass, RouterLink],
  templateUrl: './actions-sessions.component.html',
  styleUrl: './actions-sessions.component.scss',
})
export class ActionsSessionsComponent implements OnInit {
  sessionsHOCService = inject(SessionsHOCService);
  ocSidebarService = inject(OcSidebarService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  id: number = 0;
  submitted: boolean = false;
  isLoading: boolean = false;
  sessionForm!: FormGroup;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = parseInt(params['id']);
    });
    if (this.id > 0) {
      this.getOneSession(this.id);
    }
    this.sessionForm = this.fb.group({
      id: [''],
      instructorName: [null, [Validators.required]],
      topic: [null, [Validators.required]],
      locationName: [null, [Validators.required]],
      locationLink: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
    });
  }
  convertToLocal(utcDate: string): string {
    const date = new Date(utcDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  getOneSession(id: number): void {
    this.isLoading = true;
    this.sessionsHOCService.getOneSession(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          const localStartTime = this.convertToLocal(data.startDate);
          const localEndTime = this.convertToLocal(data.endDate);
          this.sessionForm.patchValue({
            id: data.id,
            instructorName: data.instructorName,
            topic: data.topic,
            startDate: localStartTime,
            endDate: localEndTime,
            locationLink: data.locationLink,
            locationName: data.locationName,
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }
  actionsSession(): void {
    this.submitted = true;
    if (this.sessionForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.isLoading = true;
    const dataForm = {
      ...this.sessionForm.value,
      startDate: new Date(
        this.sessionForm.get('startDate')?.value
      ).toISOString(),
      endDate: new Date(this.sessionForm.get('endDate')?.value).toISOString(),
    };
    if (this.id === 0) {
      this.sessionsHOCService.actionsSession(dataForm).subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
            this.router.navigate(['/head_of_camp/sessions']);
            this.isLoading = false;
            this.toastr.error(message);
            this.isLoading = false;
          } else if (statusCode === 400) {
            this.toastr.error(message);
            this.isLoading = false;
          } else if (statusCode === 500) {
            this.toastr.warning(message);
            this.isLoading = false;
          } else {
            errors.forEach((error: any) => {
              this.toastr.error(error);
            });
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    } else {
      this.sessionsHOCService.updateSession(dataForm).subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
            this.router.navigate(['/head_of_camp/sessions']);
            this.isLoading = false;
          } else if (statusCode === 400) {
            this.toastr.error(message);
            this.isLoading = false;
          } else if (statusCode === 500) {
            this.toastr.warning(message);
            this.isLoading = false;
          } else {
            errors.forEach((error: any) => {
              this.toastr.error(error);
            });
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    }
  }
  displayFormErrors() {
    Object.keys(this.sessionForm.controls).forEach((field) => {
      const control = this.sessionForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
  }
}
