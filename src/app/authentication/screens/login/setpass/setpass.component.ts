import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetService } from '../services/forget.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-setpass',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './setpass.component.html',
  styleUrl: './setpass.component.scss',
})
export class SetpassComponent {
  router = inject(Router);
  forgetService = inject(ForgetService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  email: any;
  token: any;
  isLoading: boolean = false;
  passwordFieldType: string = 'password';
  passwordFieldType2: string = 'password';

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
    this.token = this.route.snapshot.paramMap.get('token');
  }

  togglePasswordVisibility(num: number): void {
    if (num === 0) {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    } else {
      this.passwordFieldType2 =
        this.passwordFieldType2 === 'password' ? 'text' : 'password';
    }
  }

  passwordForm = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatchValidator() } // Call the validator function here
  );

  get password() {
    return this.passwordForm.get('password');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  onSubmit() {
    this.isLoading = true;
    if (this.passwordForm.invalid) {
      this.toastr.error('All fields are required');
      return;
    }
    const data = {
      password: this.passwordForm.get('confirmPassword')?.value,
      token: this.token,
      email: this.email,
    };
    this.forgetService.resetPassword(data).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode) {
          this.toastr.success(message);
          this.router.navigate(['/login']);
          this.isLoading = false;
        } else {
          this.toastr.error(message);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
