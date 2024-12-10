import { Component, inject } from '@angular/core';
import { ForgetService } from '../services/forget.service';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget.component.html',
  styleUrl: './forget.component.scss',
})
export class ForgetComponent {
  forgetService = inject(ForgetService);
  router = inject(Router);
  toastr = inject(ToastrService);
  isLoading: boolean = false;
  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  findEmail() {
    if (this.emailForm.invalid) {
      this.toastr.error('Email is required');
      return;
    }
    this.isLoading = true;
    const { email } = this.emailForm.value;
    this.forgetService.forgetPassword(email ? email : '').subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode == 200) {
          this.toastr.success(message);
          this.router.navigate(['/login/otp', email ? email : '']);
          this.isLoading = false;
        } else if (statusCode === 400) {
          this.isLoading = false;
          this.toastr.error(message);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      },
    });
  }
}
