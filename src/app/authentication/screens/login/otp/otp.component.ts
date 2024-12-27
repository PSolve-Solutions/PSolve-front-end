import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseHeader } from '../../../../shared/model/responseHeader';
import { CommonModule } from '@angular/common';
import { ForgetService } from '../services/forget.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent {
  router = inject(Router);
  forgetService = inject(ForgetService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  email: any;
  isLoading = signal<boolean>(false);
  isLoadingResend: boolean = false;
  check: boolean = false;
  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
  }

  resend() {
    this.isLoadingResend = true;
    this.forgetService.forgetPassword(this.email).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode == 200) {
          this.toastr.success(message);
          this.isLoadingResend = false;
        } else if (statusCode === 400) {
          this.isLoadingResend = false;
          this.toastr.error(errors[0]);
        } else {
          this.isLoadingResend = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoadingResend = false;
      },
    });
  }

  moveToNext(event: KeyboardEvent, nextInput: HTMLInputElement | null): void {
    const input = event.target as HTMLInputElement;
    const max = 9;
    if (parseInt(input.value, 9) > max) {
      input.value = max.toString();
    } else if (parseInt(input.value, 0) < 0) {
      input.value = '0'.toString();
    }
    if (/^[0-9]$/.test(event.key)) {
      nextInput?.focus();
    } else {
      this.toastr.warning('Enter a number!');
      input.focus();
    }
  }

  checkResetOtp(email: any, otp: string) {
    this.isLoading.set(true);
    if (otp.length == 4) {
      this.forgetService.checkResetOtp(email, otp).subscribe({
        next: ({ statusCode, message, errors, data }) => {
          if (statusCode == 200) {
            this.toastr.success(message);
            this.router.navigate(['/login/set', data, email]);
            this.isLoading.update((v) => (v = false));
          } else if (statusCode === 400) {
            this.check = true;
            this.isLoading.update((v) => (v = false));
          } else {
            this.toastr.error(errors[0]);
            this.check = true;
            this.isLoading.update((v) => (v = false));
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading.update((v) => (v = false));
        },
      });
    }
  }
  empty(inp: HTMLInputElement) {
    inp.value = '';
  }
}
